import type { SupabaseClient } from "@supabase/supabase-js";

export function computeProgressPercent(
  completedLessons: number,
  totalLessons: number,
): number {
  if (totalLessons <= 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}

export async function fetchLessonTotalsByCourse(
  supabase: SupabaseClient,
  courseIds: string[],
): Promise<Map<string, number>> {
  const totals = new Map<string, number>();
  if (courseIds.length === 0) return totals;

  const { data: modules } = await supabase
    .from("course_modules")
    .select("course_id, lessons ( id )")
    .in("course_id", courseIds);

  for (const row of modules ?? []) {
    const lessons = row.lessons as { id: string }[] | { id: string } | null;
    const count = Array.isArray(lessons) ? lessons.length : lessons ? 1 : 0;
    totals.set(row.course_id, (totals.get(row.course_id) ?? 0) + count);
  }

  return totals;
}

export async function fetchCompletedLessonsByEnrollment(
  supabase: SupabaseClient,
  enrollmentIds: string[],
): Promise<Map<string, number>> {
  const completed = new Map<string, number>();
  if (enrollmentIds.length === 0) return completed;

  const { data: rows } = await supabase
    .from("lesson_progress")
    .select("enrollment_id")
    .in("enrollment_id", enrollmentIds)
    .eq("completed", true);

  for (const row of rows ?? []) {
    completed.set(
      row.enrollment_id,
      (completed.get(row.enrollment_id) ?? 0) + 1,
    );
  }

  return completed;
}
