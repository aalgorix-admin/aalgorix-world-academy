import type { CourseEnrollmentProgress } from "./types";

type CourseProgressPanelProps = {
  enrollments: CourseEnrollmentProgress[];
};

export function CourseProgressPanel({ enrollments }: CourseProgressPanelProps) {
  return (
    <section aria-labelledby="course-progress-heading">
      <h2
        id="course-progress-heading"
        className="text-sm font-bold uppercase tracking-widest text-slate-500"
      >
        Active course tracks
      </h2>
      {enrollments.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {enrollments.map(({ course, progressPercent }) => (
            <li
              key={course.id}
              className="rounded-xl border border-slate-200 bg-[#fafafa] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900">{course.title}</p>
                  {course.curriculum_tag ? (
                    <p className="mt-0.5 text-xs font-semibold text-indigo-700">
                      {course.curriculum_tag}
                    </p>
                  ) : null}
                </div>
                <span className="text-sm font-extrabold tabular-nums text-slate-900">
                  {progressPercent}%
                </span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-600">
          No active enrollments for this learner.
        </p>
      )}
    </section>
  );
}
