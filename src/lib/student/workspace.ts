import type { LessonStatus } from "@/lib/student/curriculum-types";
import { createClient } from "@/lib/supabase/server";

export type WorkspaceLesson = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_preview: boolean;
  video_storage_path: string | null;
  resource_paths: string[];
  status: LessonStatus;
  completed: boolean;
  videoSrc: string | null;
  worksheetUrl: string | null;
  worksheetFileName: string | null;
};

export type WorkspaceModule = {
  id: string;
  title: string;
  sort_order: number;
  lessons: WorkspaceLesson[];
};

export type StudentWorkspaceData = {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  unlockStrategy: string;
  completionPercent: number;
  modules: WorkspaceModule[];
  activeLesson: WorkspaceLesson;
  assignmentId: string | null;
};

type RawLesson = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_preview: boolean;
  video_storage_path: string | null;
  resource_paths: string[] | null;
};

type RawModule = {
  id: string;
  title: string;
  sort_order: number;
  lessons: RawLesson[] | null;
};

type RawCourse = {
  id: string;
  title: string;
  unlock_strategy: string;
  course_modules: RawModule[] | null;
};

function sortModules(modules: RawModule[]): RawModule[] {
  return [...modules]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((module) => ({
      ...module,
      lessons: [...(module.lessons ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    }));
}

function computeLessonStatuses(
  orderedLessons: RawLesson[],
  completedLessonIds: Set<string>,
  unlockedLessonIds: Set<string>,
  unlockStrategy: string,
): Map<string, LessonStatus> {
  const statuses = new Map<string, LessonStatus>();

  for (let index = 0; index < orderedLessons.length; index++) {
    const lesson = orderedLessons[index];

    if (completedLessonIds.has(lesson.id)) {
      statuses.set(lesson.id, "completed");
      continue;
    }

    if (lesson.is_preview || unlockedLessonIds.has(lesson.id)) {
      statuses.set(lesson.id, "unlocked");
      continue;
    }

    if (unlockStrategy === "all_at_once") {
      statuses.set(lesson.id, "unlocked");
      continue;
    }

    if (unlockStrategy === "sequential") {
      if (index === 0) {
        statuses.set(lesson.id, "unlocked");
        continue;
      }
      const previous = orderedLessons[index - 1];
      if (completedLessonIds.has(previous.id)) {
        statuses.set(lesson.id, "unlocked");
      } else {
        statuses.set(lesson.id, "locked");
      }
      continue;
    }

    statuses.set(lesson.id, "locked");
  }

  return statuses;
}

function fileNameFromPath(path: string): string {
  const segments = path.split("/");
  return segments[segments.length - 1] ?? path;
}

async function resolveSignedUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  path: string | null,
): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}

export async function fetchStudentWorkspace(
  courseId: string,
  lessonId: string,
): Promise<
  | { data: StudentWorkspaceData; error: null }
  | { data: null; error: "unauthenticated" | "not_enrolled" | "not_found" | string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "unauthenticated" };
  }

  const { data: enrollment, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("id, student_id, course_id, status")
    .eq("student_id", user.id)
    .eq("course_id", courseId)
    .eq("status", "active")
    .maybeSingle();

  if (enrollmentError) {
    return { data: null, error: enrollmentError.message };
  }

  if (!enrollment) {
    return { data: null, error: "not_enrolled" };
  }

  const { data: courseRow, error: courseError } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      unlock_strategy,
      course_modules (
        id,
        title,
        sort_order,
        lessons (
          id,
          title,
          description,
          sort_order,
          is_preview,
          video_storage_path,
          resource_paths
        )
      )
    `,
    )
    .eq("id", courseId)
    .maybeSingle();

  if (courseError) {
    return { data: null, error: courseError.message };
  }

  if (!courseRow) {
    return { data: null, error: "not_found" };
  }

  const course = courseRow as RawCourse;
  const modules = sortModules(course.course_modules ?? []);
  const orderedLessons = modules.flatMap((module) => module.lessons ?? []);

  if (orderedLessons.length === 0) {
    return { data: null, error: "not_found" };
  }

  const lessonIds = orderedLessons.map((lesson) => lesson.id);

  const [{ data: progressRows }, { data: unlockRows }, { data: assignment }] =
    await Promise.all([
      supabase
        .from("lesson_progress")
        .select("lesson_id, completed")
        .eq("enrollment_id", enrollment.id)
        .in("lesson_id", lessonIds),
      supabase
        .from("content_unlocks")
        .select("lesson_id")
        .eq("enrollment_id", enrollment.id)
        .in("lesson_id", lessonIds),
      supabase
        .from("assignments")
        .select("id")
        .eq("lesson_id", lessonId)
        .eq("is_published", true)
        .maybeSingle(),
    ]);

  const completedLessonIds = new Set(
    (progressRows ?? [])
      .filter((row) => row.completed)
      .map((row) => row.lesson_id),
  );

  const unlockedLessonIds = new Set((unlockRows ?? []).map((row) => row.lesson_id));

  const statusByLessonId = computeLessonStatuses(
    orderedLessons,
    completedLessonIds,
    unlockedLessonIds,
    course.unlock_strategy,
  );

  const totalLessons = orderedLessons.length;
  const completedCount = [...statusByLessonId.values()].filter(
    (status) => status === "completed",
  ).length;
  const completionPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  let activeRaw = orderedLessons.find((lesson) => lesson.id === lessonId);
  const activeStatus = activeRaw ? statusByLessonId.get(activeRaw.id) : undefined;

  if (!activeRaw || activeStatus === "locked") {
    activeRaw =
      orderedLessons.find((lesson) => statusByLessonId.get(lesson.id) === "unlocked") ??
      orderedLessons.find((lesson) => statusByLessonId.get(lesson.id) === "completed") ??
      orderedLessons[0];
  }

  const workspaceModules: WorkspaceModule[] = [];

  for (const module of modules) {
    const lessons: WorkspaceLesson[] = [];

    for (const lesson of module.lessons ?? []) {
      const status = statusByLessonId.get(lesson.id) ?? "locked";
      const completed = status === "completed";
      const isActive = lesson.id === activeRaw!.id;

      let videoSrc: string | null = null;
      let worksheetUrl: string | null = null;

      if (isActive) {
        videoSrc = await resolveSignedUrl(
          supabase,
          "lesson-videos",
          lesson.video_storage_path,
        );

        const resourcePath = (lesson.resource_paths ?? [])[0] ?? null;
        if (resourcePath) {
          worksheetUrl = await resolveSignedUrl(supabase, "assignment-files", resourcePath);
        }
      }

      lessons.push({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        sort_order: lesson.sort_order,
        is_preview: lesson.is_preview,
        video_storage_path: lesson.video_storage_path,
        resource_paths: lesson.resource_paths ?? [],
        status,
        completed,
        videoSrc,
        worksheetUrl,
        worksheetFileName: (lesson.resource_paths ?? [])[0]
          ? fileNameFromPath((lesson.resource_paths ?? [])[0]!)
          : null,
      });
    }

    workspaceModules.push({
      id: module.id,
      title: module.title,
      sort_order: module.sort_order,
      lessons,
    });
  }

  const activeLesson =
    workspaceModules.flatMap((module) => module.lessons).find((l) => l.id === activeRaw!.id)!;

  return {
    data: {
      enrollmentId: enrollment.id,
      studentId: user.id,
      courseId: course.id,
      courseTitle: course.title,
      unlockStrategy: course.unlock_strategy,
      completionPercent,
      modules: workspaceModules,
      activeLesson,
      assignmentId: assignment?.id ?? null,
    },
    error: null,
  };
}

export async function fetchFirstLessonIdForCourse(
  courseId: string,
): Promise<string | null> {
  const supabase = await createClient();
  const { data: modules } = await supabase
    .from("course_modules")
    .select("sort_order, lessons ( id, sort_order )")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  const ordered = [...(modules ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  for (const module of ordered) {
    const lessons = [...((module.lessons as { id: string; sort_order: number }[] | null) ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    if (lessons[0]) return lessons[0].id;
  }
  return null;
}

export function toSidebarModules(modules: WorkspaceModule[]) {
  return modules.map((module) => ({
    id: module.id,
    title: module.title,
    lessons: module.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      status: lesson.status,
    })),
  }));
}
