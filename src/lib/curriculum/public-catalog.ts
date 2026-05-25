import { createClient } from "@/lib/supabase/server";

export type PublicCourseCard = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  grade_level: string | null;
  curriculum_tag: string | null;
  thumbnail_url: string | null;
  unlock_strategy: string;
  moduleCount: number;
  lessonCount: number;
};

export type PublicLessonOutline = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_preview: boolean;
};

export type PublicModuleOutline = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  lessons: PublicLessonOutline[];
};

export type PublicCourseDetail = PublicCourseCard & {
  drip_interval_days: number | null;
  modules: PublicModuleOutline[];
};

type RawLesson = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_preview: boolean;
};

type RawModule = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  lessons: RawLesson[] | null;
};

type RawCourse = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  grade_level: string | null;
  curriculum_tag: string | null;
  thumbnail_url: string | null;
  unlock_strategy: string;
  drip_interval_days: number | null;
  sort_order: number;
  course_modules: RawModule[] | null;
};

function sortModules(modules: PublicModuleOutline[]): PublicModuleOutline[] {
  return [...modules]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((module) => ({
      ...module,
      lessons: [...module.lessons].sort((a, b) => a.sort_order - b.sort_order),
    }));
}

function toPublicCourseCard(row: RawCourse): PublicCourseCard {
  const modules = row.course_modules ?? [];
  const lessonCount = modules.reduce(
    (sum, module) => sum + (module.lessons?.length ?? 0),
    0,
  );

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    grade_level: row.grade_level,
    curriculum_tag: row.curriculum_tag,
    thumbnail_url: row.thumbnail_url,
    unlock_strategy: row.unlock_strategy,
    moduleCount: modules.length,
    lessonCount,
  };
}

function toPublicCourseDetail(row: RawCourse): PublicCourseDetail {
  const modules: PublicModuleOutline[] = (row.course_modules ?? []).map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    sort_order: module.sort_order,
    lessons: (module.lessons ?? []).map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      sort_order: lesson.sort_order,
      is_preview: lesson.is_preview,
    })),
  }));

  return {
    ...toPublicCourseCard(row),
    drip_interval_days: row.drip_interval_days,
    modules: sortModules(modules),
  };
}

const publishedCourseSelect = `
  id,
  slug,
  title,
  description,
  grade_level,
  curriculum_tag,
  thumbnail_url,
  unlock_strategy,
  drip_interval_days,
  sort_order,
  course_modules (
    id,
    title,
    description,
    sort_order,
    lessons (
      id,
      title,
      description,
      sort_order,
      is_preview
    )
  )
`;

export async function fetchPublishedCourses(): Promise<{
  courses: PublicCourseCard[];
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(publishedCourseSelect)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return { courses: [], error: error.message };
  }

  const courses = ((data ?? []) as RawCourse[]).map(toPublicCourseCard);

  return { courses, error: null };
}

export async function fetchPublishedCourseBySlug(
  slug: string,
): Promise<{ course: PublicCourseDetail | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(publishedCourseSelect)
    .eq("is_published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return { course: null, error: error.message };
  }

  if (!data) {
    return { course: null, error: null };
  }

  return { course: toPublicCourseDetail(data as RawCourse), error: null };
}

export function formatUnlockStrategy(strategy: string): string {
  return strategy.replaceAll("_", " ");
}
