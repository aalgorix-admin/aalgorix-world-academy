"use server";

import { revalidatePath } from "next/cache";

import { unwrapOne } from "@/lib/dashboard/relations";
import { createClient } from "@/lib/supabase/server";

import type { StoragePathEntry } from "./types";

const GRADING_PATH = "/teacher/grading";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

export type TeacherGradingActionState = {
  ok: boolean;
  error?: string;
  message?: string;
};

type TeacherContext =
  | { supabase: Awaited<ReturnType<typeof createClient>>; userId: string }
  | { error: string };

async function requireTeacher(): Promise<TeacherContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "teacher") {
    return { error: "Only teachers can access the grading terminal." };
  }

  return { supabase, userId: user.id };
}

async function assertTeacherOwnsSubmissionCourse(
  supabase: Awaited<ReturnType<typeof createClient>>,
  teacherId: string,
  submissionId: string,
): Promise<
  | { error: string }
  | {
      submission: {
        id: string;
        storage_paths: StoragePathEntry[];
        assignment_id: string;
      };
      courseId: string;
    }
> {
  const { data: submission, error } = await supabase
    .from("submissions")
    .select(
      `
      id,
      storage_paths,
      assignment_id,
      assignments (
        course_id
      )
    `,
    )
    .eq("id", submissionId)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!submission) {
    return { error: "Submission not found." };
  }

  const assignment = unwrapOne(
    submission.assignments as { course_id: string } | { course_id: string }[] | null,
  );
  const courseId = assignment?.course_id ?? null;

  if (!courseId) {
    return { error: "Assignment context is missing for this submission." };
  }

  const { data: assignmentRow } = await supabase
    .from("teacher_course_assignments")
    .select("course_id")
    .eq("teacher_id", teacherId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (!assignmentRow) {
    return { error: "You are not authorized to grade submissions for this course." };
  }

  const storagePaths = Array.isArray(submission.storage_paths)
    ? (submission.storage_paths as StoragePathEntry[])
    : [];

  return {
    submission: {
      id: submission.id,
      storage_paths: storagePaths,
      assignment_id: submission.assignment_id,
    },
    courseId,
  };
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseGrade(raw: string): number | null {
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    return null;
  }
  return parsed;
}

export async function getSubmissionDownloadUrl(
  submissionId: string,
  storagePath: string,
): Promise<{ url: string | null; error?: string }> {
  if (!submissionId || !storagePath) {
    return { url: null, error: "Missing submission or file reference." };
  }

  const ctx = await requireTeacher();
  if ("error" in ctx) {
    return { url: null, error: ctx.error };
  }

  const access = await assertTeacherOwnsSubmissionCourse(
    ctx.supabase,
    ctx.userId,
    submissionId,
  );

  if ("error" in access) {
    return { url: null, error: access.error };
  }

  const allowed = access.submission.storage_paths.some(
    (entry) => entry.path === storagePath,
  );

  if (!allowed) {
    return { url: null, error: "File is not attached to this submission." };
  }

  const { data, error } = await ctx.supabase.storage
    .from("submissions")
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    return { url: null, error: error?.message ?? "Could not generate download link." };
  }

  return { url: data.signedUrl };
}

export async function submitTeacherEvaluation(
  _prev: TeacherGradingActionState | null,
  formData: FormData,
): Promise<TeacherGradingActionState> {
  const submissionId = readString(formData, "submission_id");
  const intent = readString(formData, "intent");
  const feedback = readString(formData, "feedback");
  const gradeRaw = readString(formData, "grade");

  if (!submissionId) {
    return { ok: false, error: "Missing submission identifier." };
  }

  if (intent !== "grade" && intent !== "return") {
    return { ok: false, error: "Invalid evaluation action." };
  }

  const ctx = await requireTeacher();
  if ("error" in ctx) {
    return { ok: false, error: ctx.error };
  }

  const access = await assertTeacherOwnsSubmissionCourse(
    ctx.supabase,
    ctx.userId,
    submissionId,
  );

  if ("error" in access) {
    return { ok: false, error: access.error };
  }

  const now = new Date().toISOString();

  if (intent === "return") {
    if (!feedback) {
      return {
        ok: false,
        error: "Provide revision notes so the student knows what to improve.",
      };
    }

    const { error } = await ctx.supabase
      .from("submissions")
      .update({
        status: "returned",
        feedback,
        grade: null,
        graded_by: ctx.userId,
        graded_at: now,
        updated_at: now,
      })
      .eq("id", submissionId);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath(GRADING_PATH);
    return { ok: true, message: "Revision request sent to the student." };
  }

  const grade = parseGrade(gradeRaw);
  if (grade === null) {
    return { ok: false, error: "Enter a numeric score between 0 and 100." };
  }

  const { error } = await ctx.supabase
    .from("submissions")
    .update({
      status: "graded",
      grade,
      feedback: feedback || null,
      graded_by: ctx.userId,
      graded_at: now,
      updated_at: now,
    })
    .eq("id", submissionId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(GRADING_PATH);
  return { ok: true, message: "Grade logged and student notified via portal." };
}
