import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { CatalogPanel } from "./catalog-panel";
import {
  buildCatalogStats,
  sortCatalogCourses,
  type CatalogCourse,
  type CatalogLesson,
  type CatalogModule,
} from "./types";

type RawLesson = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_preview: boolean;
  video_storage_path: string | null;
  video_duration_seconds: number | null;
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
  is_published: boolean;
  unlock_strategy: string;
  drip_interval_days: number | null;
  sort_order: number;
  created_at: string;
  course_modules: RawModule[] | null;
};

function normalizeCourse(row: RawCourse): CatalogCourse {
  const modules: CatalogModule[] = (row.course_modules ?? []).map((module) => {
    const lessons: CatalogLesson[] = (module.lessons ?? []).map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      sort_order: lesson.sort_order,
      is_preview: lesson.is_preview,
      video_storage_path: lesson.video_storage_path,
      video_duration_seconds: lesson.video_duration_seconds,
    }));

    return {
      id: module.id,
      title: module.title,
      description: module.description,
      sort_order: module.sort_order,
      lessons,
    };
  });

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    grade_level: row.grade_level,
    curriculum_tag: row.curriculum_tag,
    thumbnail_url: row.thumbnail_url,
    is_published: row.is_published,
    unlock_strategy: row.unlock_strategy,
    drip_interval_days: row.drip_interval_days,
    sort_order: row.sort_order,
    created_at: row.created_at,
    modules,
  };
}

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin/courses");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin");
  }

  const { data: rows, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      slug,
      title,
      description,
      grade_level,
      curriculum_tag,
      thumbnail_url,
      is_published,
      unlock_strategy,
      drip_interval_days,
      sort_order,
      created_at,
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
          is_preview,
          video_storage_path,
          video_duration_seconds
        )
      )
    `,
    )
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Course catalog</h1>
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          Could not load courses: {error.message}
        </p>
      </main>
    );
  }

  const courses = sortCatalogCourses(
    ((rows ?? []) as RawCourse[]).map(normalizeCourse),
  );
  const stats = buildCatalogStats(courses);

  return <CatalogPanel courses={courses} stats={stats} />;
}
