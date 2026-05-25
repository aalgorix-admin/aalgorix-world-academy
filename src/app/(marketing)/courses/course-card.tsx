import Link from "next/link";

import {
  formatUnlockStrategy,
  type PublicCourseCard,
} from "@/lib/curriculum/public-catalog";

const cardClassName =
  "flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md";

export function PublicCourseCard({ course }: { course: PublicCourseCard }) {
  return (
    <article className={cardClassName}>
      {course.thumbnail_url ? (
        <div className="mb-4 overflow-hidden rounded-xl bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.thumbnail_url}
            alt=""
            className="h-36 w-full object-cover"
          />
        </div>
      ) : (
        <div className="mb-4 flex h-36 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50">
          <span className="text-4xl font-extrabold text-indigo-200">
            {course.title.charAt(0)}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {course.curriculum_tag ? (
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 ring-1 ring-indigo-200">
            {course.curriculum_tag}
          </span>
        ) : null}
        {course.grade_level ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {course.grade_level}
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
        {course.title}
      </h3>

      {course.description ? (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
          {course.description}
        </p>
      ) : (
        <p className="mt-2 flex-1 text-sm text-slate-400">Course overview coming soon.</p>
      )}

      <dl className="mt-4 flex flex-wrap gap-x-4 text-xs text-slate-500">
        <div>
          <dt className="inline font-medium">Modules:</dt>{" "}
          <dd className="inline">{course.moduleCount}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Lessons:</dt>{" "}
          <dd className="inline">{course.lessonCount}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Pacing:</dt>{" "}
          <dd className="inline capitalize">{formatUnlockStrategy(course.unlock_strategy)}</dd>
        </div>
      </dl>

      <Link
        href={`/courses/${course.slug}`}
        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 transition hover:text-violet-700"
      >
        View syllabus
        <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
