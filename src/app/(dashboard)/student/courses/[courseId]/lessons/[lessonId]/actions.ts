"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

const MAX_SUBMISSION_BYTES = 26_214_400;

export type StudentLessonActionState = {
  ok: boolean;
  error?: string;
  message?: string;
};

function lessonWorkspacePath(courseId: string, lessonId: string): string {
  return `/student/courses/${courseId}/lessons/${lessonId}`;
}

function revalidateWorkspace(courseId: string, lessonId: string) {
  revalidatePath(lessonWorkspacePath(courseId, lessonId));
}

async function requireActiveEnrollment(courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in.", supabase: null, userId: null, enrollment: null };
  }

  const { data: enrollment, error } = await supabase
    .from("enrollments")
    .select("id, student_id, status")
    .eq("student_id", user.id)
    .eq("course_id", courseId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    return { error: error.message, supabase: null, userId: null, enrollment: null };
  }

  if (!enrollment) {
    return {
      error: "You are not actively enrolled in this course.",
      supabase: null,
      userId: null,
      enrollment: null,
    };
  }

  return { error: null, supabase, userId: user.id, enrollment };
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function toggleLessonProgress(
  _prev: StudentLessonActionState | null,
  formData: FormData,
): Promise<StudentLessonActionState> {
  const courseId = readString(formData, "course_id");
  const lessonId = readString(formData, "lesson_id");
  const enrollmentId = readString(formData, "enrollment_id");
  const markComplete = readString(formData, "completed") === "true";

  if (!courseId || !lessonId || !enrollmentId) {
    return { ok: false, error: "Missing course or lesson context." };
  }

  const ctx = await requireActiveEnrollment(courseId);
  if (ctx.error || !ctx.supabase || !ctx.enrollment) {
    return { ok: false, error: ctx.error ?? "Unauthorized." };
  }

  if (ctx.enrollment.id !== enrollmentId) {
    return { ok: false, error: "Enrollment mismatch." };
  }

  if (markComplete) {
    const { error } = await ctx.supabase.from("lesson_progress").upsert(
      {
        enrollment_id: enrollmentId,
        lesson_id: lessonId,
        completed: true,
        progress_percent: 100,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "enrollment_id,lesson_id" },
    );

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateWorkspace(courseId, lessonId);
    return { ok: true, message: "Lesson marked complete." };
  }

  const { error } = await ctx.supabase
    .from("lesson_progress")
    .delete()
    .eq("enrollment_id", enrollmentId)
    .eq("lesson_id", lessonId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateWorkspace(courseId, lessonId);
  return { ok: true, message: "Lesson completion cleared." };
}

export async function submitHomework(
  _prev: StudentLessonActionState | null,
  formData: FormData,
): Promise<StudentLessonActionState> {
  const courseId = readString(formData, "course_id");
  const lessonId = readString(formData, "lesson_id");
  const enrollmentId = readString(formData, "enrollment_id");
  const assignmentId = readString(formData, "assignment_id");

  if (!courseId || !lessonId || !enrollmentId) {
    return { ok: false, error: "Missing course or lesson context." };
  }

  const ctx = await requireActiveEnrollment(courseId);
  if (ctx.error || !ctx.supabase || !ctx.userId || !ctx.enrollment) {
    return { ok: false, error: ctx.error ?? "Unauthorized." };
  }

  if (ctx.enrollment.id !== enrollmentId) {
    return { ok: false, error: "Enrollment mismatch." };
  }

  if (!assignmentId) {
    return {
      ok: false,
      error:
        "No published assignment exists for this lesson yet. Ask your teacher to publish one.",
    };
  }

  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return { ok: false, error: "Select at least one file to upload." };
  }

  const uploadedPaths: { path: string; name: string; size: number }[] = [];

  for (const file of files) {
    if (file.size === 0) continue;
    if (file.size > MAX_SUBMISSION_BYTES) {
      return { ok: false, error: `${file.name} exceeds the 25 MB limit.` };
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storagePath = `${ctx.userId}/${lessonId}/${safeName}`;

    const { error: uploadError } = await ctx.supabase.storage
      .from("submissions")
      .upload(storagePath, file, {
        upsert: true,
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      return { ok: false, error: uploadError.message };
    }

    uploadedPaths.push({ path: storagePath, name: file.name, size: file.size });
  }

  if (uploadedPaths.length === 0) {
    return { ok: false, error: "No valid files to upload." };
  }

  const { data: existing } = await ctx.supabase
    .from("submissions")
    .select("id, storage_paths, status")
    .eq("assignment_id", assignmentId)
    .eq("student_id", ctx.userId)
    .maybeSingle();

  const mergedPaths = [
    ...((existing?.storage_paths as { path: string; name: string; size: number }[] | null) ??
      []),
    ...uploadedPaths,
  ];

  const payload = {
    assignment_id: assignmentId,
    student_id: ctx.userId,
    enrollment_id: enrollmentId,
    status: "submitted" as const,
    storage_paths: mergedPaths,
    submitted_at: new Date().toISOString(),
  };

  const { error: saveError } = existing
    ? await ctx.supabase.from("submissions").update(payload).eq("id", existing.id)
    : await ctx.supabase.from("submissions").insert(payload);

  if (saveError) {
    return { ok: false, error: saveError.message };
  }

  revalidateWorkspace(courseId, lessonId);
  return { ok: true, message: "Homework submitted to your teacher." };
}
