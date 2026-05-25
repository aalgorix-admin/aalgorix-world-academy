export type CatalogLesson = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_preview: boolean;
  video_storage_path: string | null;
  video_duration_seconds: number | null;
};

export type CatalogModule = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  lessons: CatalogLesson[];
};

export type CatalogCourse = {
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
  modules: CatalogModule[];
};

export type CatalogStats = {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalModules: number;
  totalLessons: number;
};

export function buildCatalogStats(courses: CatalogCourse[]): CatalogStats {
  let totalModules = 0;
  let totalLessons = 0;

  for (const course of courses) {
    totalModules += course.modules.length;
    for (const module of course.modules) {
      totalLessons += module.lessons.length;
    }
  }

  const publishedCourses = courses.filter((c) => c.is_published).length;

  return {
    totalCourses: courses.length,
    publishedCourses,
    draftCourses: courses.length - publishedCourses,
    totalModules,
    totalLessons,
  };
}

export function sortCatalogCourses(courses: CatalogCourse[]): CatalogCourse[] {
  return [...courses]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((course) => ({
      ...course,
      modules: [...course.modules]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((module) => ({
          ...module,
          lessons: [...module.lessons].sort((a, b) => a.sort_order - b.sort_order),
        })),
    }));
}
