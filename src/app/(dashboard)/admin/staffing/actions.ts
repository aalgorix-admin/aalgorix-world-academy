"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

const STAFFING_PATH = "/admin/staffing";

export type StaffingActionState = {
  ok: boolean;
  error?: string;
  message?: string;
};

type AdminContext =
  | { supabase: Awaited<ReturnType<typeof createClient>> }
  | { error: string };

async function requireAdmin(): Promise<AdminContext> {
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

  if (profile?.role !== "admin") {
    return { error: "Only administrators can manage staffing allocations." };
  }

  return { supabase };
}

function revalidateStaffing() {
  revalidatePath(STAFFING_PATH);
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

async function validateTeacher(
  supabase: Awaited<ReturnType<typeof createClient>>,
  teacherId: string,
): Promise<StaffingActionState | null> {
  if (!isUuid(teacherId)) {
    return { ok: false, error: "Invalid teacher identifier." };
  }

  const { data: teacher, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", teacherId)
    .maybeSingle();

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!teacher) {
    return { ok: false, error: "Teacher profile not found." };
  }

  if (teacher.role !== "teacher") {
    return {
      ok: false,
      error: "Course allocations can only be assigned to accounts with the teacher role.",
    };
  }

  return null;
}

async function validatePublishedCourse(
  supabase: Awaited<ReturnType<typeof createClient>>,
  courseId: string,
): Promise<StaffingActionState | null> {
  if (!isUuid(courseId)) {
    return { ok: false, error: "Invalid course identifier." };
  }

  const { data: course, error } = await supabase
    .from("courses")
    .select("id, title, is_published")
    .eq("id", courseId)
    .maybeSingle();

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!course) {
    return { ok: false, error: "Course not found." };
  }

  if (!course.is_published) {
    return {
      ok: false,
      error: "Only published courses can be linked to teachers from this panel.",
    };
  }

  return null;
}

export async function linkTeacherToCourse(
  _prev: StaffingActionState | null,
  formData: FormData,
): Promise<StaffingActionState> {
  const ctx = await requireAdmin();
  if ("error" in ctx) {
    return { ok: false, error: ctx.error };
  }

  const teacherId = readString(formData, "teacher_id");
  const courseId = readString(formData, "course_id");

  if (!teacherId || !courseId) {
    return { ok: false, error: "Teacher and course are required." };
  }

  const teacherError = await validateTeacher(ctx.supabase, teacherId);
  if (teacherError) return teacherError;

  const courseError = await validatePublishedCourse(ctx.supabase, courseId);
  if (courseError) return courseError;

  const { data: existing } = await ctx.supabase
    .from("teacher_course_assignments")
    .select("teacher_id")
    .eq("teacher_id", teacherId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (existing) {
    return { ok: false, error: "This teacher is already assigned to the selected course." };
  }

  const { error } = await ctx.supabase.from("teacher_course_assignments").insert({
    teacher_id: teacherId,
    course_id: courseId,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateStaffing();
  return { ok: true, message: "Course allocation linked." };
}

export async function removeTeacherFromCourse(
  _prev: StaffingActionState | null,
  formData: FormData,
): Promise<StaffingActionState> {
  const ctx = await requireAdmin();
  if ("error" in ctx) {
    return { ok: false, error: ctx.error };
  }

  const teacherId = readString(formData, "teacher_id");
  const courseId = readString(formData, "course_id");

  if (!teacherId || !courseId) {
    return { ok: false, error: "Teacher and course are required." };
  }

  if (!isUuid(teacherId) || !isUuid(courseId)) {
    return { ok: false, error: "Invalid teacher or course identifier." };
  }

  const { error } = await ctx.supabase
    .from("teacher_course_assignments")
    .delete()
    .eq("teacher_id", teacherId)
    .eq("course_id", courseId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateStaffing();
  return { ok: true, message: "Course allocation removed." };
}

