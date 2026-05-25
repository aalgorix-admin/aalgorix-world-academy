import {
  submissionStatusBadgeClass,
  submissionStatusLabel,
  type SubmissionStatus,
} from "@/lib/dashboard/submission-status";

import type { GradingTimelineEntry } from "./types";

type GradingTimelineProps = {
  entries: GradingTimelineEntry[];
};

function formatTimelineDate(iso: string | null): string {
  if (!iso) return "Date pending";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function assignmentTypeLabel(entry: GradingTimelineEntry): string {
  if (entry.lessonTitle) return `Lesson · ${entry.lessonTitle}`;
  return "Course assignment";
}

function scoreBadge(entry: GradingTimelineEntry): { label: string; className: string } {
  if (entry.status === "graded" && entry.grade != null) {
    return {
      label: `${entry.grade}%`,
      className: submissionStatusBadgeClass("graded"),
    };
  }
  return {
    label: submissionStatusLabel(entry.status),
    className: submissionStatusBadgeClass(entry.status),
  };
}

function ReadOnlyFileBadge({ name }: { name: string }) {
  return (
    <span
      title="Parents have read-only access; downloads are managed by the student account."
      aria-disabled="true"
      className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 opacity-80"
    >
      <svg
        viewBox="0 0 20 20"
        className="h-3.5 w-3.5 shrink-0"
        fill="currentColor"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1h1a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h1V4zm2 0v1h6V4H7zm-1 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span className="truncate">{name}</span>
      <span className="shrink-0 uppercase tracking-wide">Read-only</span>
    </span>
  );
}

export function GradingTimeline({ entries }: GradingTimelineProps) {
  return (
    <section aria-labelledby="grading-timeline-heading">
      <h2
        id="grading-timeline-heading"
        className="text-sm font-bold uppercase tracking-widest text-slate-500"
      >
        Historical feedback &amp; grading
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Chronological view of teacher evaluations, scores, and revision notes.
      </p>

      {entries.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600">
          No submission history yet. Graded work and teacher feedback will appear here.
        </p>
      ) : (
        <ol className="relative mt-6 space-y-0">
          {entries.map((entry, index) => {
            const badge = scoreBadge(entry);
            const displayDate = formatTimelineDate(entry.gradedAt ?? entry.submittedAt);
            const isLast = index === entries.length - 1;

            return (
              <li key={entry.id} className="relative flex gap-4 pb-10">
                <div className="flex flex-col items-center">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-full bg-indigo-600 ring-4 ring-indigo-100"
                    aria-hidden
                  />
                  {!isLast ? (
                    <span
                      className="mt-1 w-px flex-1 bg-slate-200"
                      aria-hidden
                    />
                  ) : null}
                </div>

                <article className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                        {entry.courseTitle}
                      </p>
                      <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                        {entry.assignmentTitle}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {assignmentTypeLabel(entry)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-sm font-extrabold tabular-nums ring-1 ring-inset ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <p className="mt-3 text-xs font-medium text-slate-500">{displayDate}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ring-inset ${submissionStatusBadgeClass(entry.status as SubmissionStatus)}`}
                    >
                      {submissionStatusLabel(entry.status)}
                    </span>
                  </div>

                  {entry.feedback ? (
                    <blockquote className="mt-4 rounded-xl border border-slate-100 bg-[#fafafa] px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Teacher feedback
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-800">
                        {entry.feedback}
                      </p>
                    </blockquote>
                  ) : (
                    <p className="mt-4 text-sm italic text-slate-500">
                      No written feedback for this entry.
                    </p>
                  )}

                  {entry.storagePaths.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {entry.storagePaths.map((file) => (
                        <ReadOnlyFileBadge key={file.path} name={file.name} />
                      ))}
                    </div>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
