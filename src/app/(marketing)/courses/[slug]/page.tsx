import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fetchPublishedCourseBySlug,
  formatUnlockStrategy,
} from "@/lib/curriculum/public-catalog";
import { appUrl } from "@/lib/domains";

import { MarketingNav } from "../../marketing-nav";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { course } = await fetchPublishedCourseBySlug(slug);

  if (!course) {
    return { title: "Course not found" };
  }

  return {
    title: `${course.title} — Aalgorix World Academy`,
    description: course.description ?? `Syllabus for ${course.title}`,
  };
}

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500";

export default async function PublicCourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { course, error } = await fetchPublishedCourseBySlug(slug);

  if (error) {
    return (
      <>
        <MarketingNav />
        <main className="mx-auto max-w-2xl px-6 py-16">
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Could not load course: {error}
          </p>
        </main>
      </>
    );
  }

  if (!course) {
    notFound();
  }

  return (
    <>
      <MarketingNav />
      <main className="flex-1 bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            <Link
              href="/courses"
              className="text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
            >
              ← All courses
            </Link>

            <div className="mt-4 flex flex-wrap gap-2">
              {course.curriculum_tag ? (
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800">
                  {course.curriculum_tag}
                </span>
              ) : null}
              {course.grade_level ? (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {course.grade_level}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {course.title}
            </h1>

            {course.description ? (
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                {course.description}
              </p>
            ) : null}

            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <div>
                <dt className="inline font-medium text-slate-700">Modules:</dt>{" "}
                <dd className="inline">{course.moduleCount}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-slate-700">Lessons:</dt>{" "}
                <dd className="inline">{course.lessonCount}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-slate-700">Pacing:</dt>{" "}
                <dd className="inline capitalize">
                  {formatUnlockStrategy(course.unlock_strategy)}
                </dd>
              </div>
              {course.unlock_strategy === "drip" && course.drip_interval_days ? (
                <div>
                  <dt className="inline font-medium text-slate-700">Drip:</dt>{" "}
                  <dd className="inline">Every {course.drip_interval_days} days</dd>
                </div>
              ) : null}
            </dl>

            <Link href={appUrl("/signup")} className={`${btnPrimary} mt-8`}>
              Enroll via family account
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-900">Syllabus outline</h2>
          <p className="mt-1 text-sm text-slate-500">
            Lesson videos and assignments unlock after enrollment (Phase 4).
          </p>

          {course.modules.length === 0 ? (
            <p className="mt-8 text-slate-600">Syllabus content is being prepared.</p>
          ) : (
            <ol className="mt-8 space-y-6">
              {course.modules.map((module, moduleIndex) => (
                <li
                  key={module.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                    Module {moduleIndex + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">{module.title}</h3>
                  {module.description ? (
                    <p className="mt-2 text-sm text-slate-600">{module.description}</p>
                  ) : null}

                  {module.lessons.length > 0 ? (
                    <ul className="mt-4 divide-y divide-slate-100">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li
                          key={lesson.id}
                          className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {lessonIndex + 1}. {lesson.title}
                            </p>
                            {lesson.description ? (
                              <p className="mt-0.5 text-xs text-slate-500">
                                {lesson.description}
                              </p>
                            ) : null}
                          </div>
                          {lesson.is_preview ? (
                            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                              Preview
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs text-slate-400">No lessons listed yet.</p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
    </>
  );
}
