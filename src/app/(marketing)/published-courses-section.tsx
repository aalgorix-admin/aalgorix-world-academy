import Link from "next/link";

import { fetchPublishedCourses } from "@/lib/curriculum/public-catalog";

import { PublicCourseCard } from "./courses/course-card";

const btnLink =
  "inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 transition-all duration-200 hover:text-violet-700 active:scale-[0.98]";

export async function PublishedCoursesSection() {
  const { courses, error } = await fetchPublishedCourses();
  const featured = courses.slice(0, 3);

  if (error || featured.length === 0) {
    return null;
  }

  return (
    <section
      id="published-courses"
      className="scroll-mt-24 border-t border-slate-100 bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Published courses
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Live catalog entries from our admin curriculum panel—updated as your team
            publishes new pathways.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <PublicCourseCard key={course.id} course={course} />
          ))}
        </div>

        {courses.length > 3 ? (
          <p className="mt-8 text-center">
            <Link href="/courses" className={btnLink}>
              View all {courses.length} courses
              <span aria-hidden>→</span>
            </Link>
          </p>
        ) : (
          <p className="mt-8 text-center">
            <Link href="/courses" className={btnLink}>
              Browse course catalog
              <span aria-hidden>→</span>
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
