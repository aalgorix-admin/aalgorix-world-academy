"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState, useTransition } from "react";

import { StatCard } from "@/components/dashboard/stat-card";

import {
  getSubmissionDownloadUrl,
  submitTeacherEvaluation,
  type TeacherGradingActionState,
} from "./actions";
import type { GradingQueueItem, GradingQueueMetrics, SubmissionStatus } from "./types";

type GradingStationProps = {
  items: GradingQueueItem[];
  metrics: GradingQueueMetrics;
  courseOptions: { id: string; title: string }[];
};

const initialActionState: TeacherGradingActionState | null = null;

const STATUS_FILTER_OPTIONS: { value: "all" | SubmissionStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "submitted", label: "Submitted" },
  { value: "graded", label: "Graded" },
  { value: "returned", label: "Returned" },
];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusBadgeClass(status: SubmissionStatus): string {
  switch (status) {
    case "submitted":
      return "bg-amber-100 text-amber-900 ring-amber-200";
    case "graded":
      return "bg-emerald-100 text-emerald-900 ring-emerald-200";
    case "returned":
      return "bg-rose-100 text-rose-900 ring-rose-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function statusLabel(status: SubmissionStatus): string {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "graded":
      return "Graded";
    case "returned":
      return "Returned";
    default:
      return status;
  }
}

function ActionBanner({ state }: { state: TeacherGradingActionState | null }) {
  if (!state?.message && !state?.error) return null;
  return (
    <p
      role="status"
      className={
        state.error
          ? "rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
          : "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
      }
    >
      {state.error ?? state.message}
    </p>
  );
}

export function GradingStation({ items, metrics, courseOptions }: GradingStationProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<"all" | SubmissionStatus>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");
  const [downloadPending, startDownload] = useTransition();
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const [evalState, evalAction, evalPending] = useActionState(
    submitTeacherEvaluation,
    initialActionState,
  );

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (courseFilter !== "all" && item.courseId !== courseFilter) return false;
      if (!query) return true;
      const haystack = [
        item.studentName,
        item.courseTitle,
        item.lessonTitle ?? "",
        item.assignmentTitle,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [items, statusFilter, courseFilter, searchQuery]);

  useEffect(() => {
    if (!selected) {
      setFeedback("");
      setGrade("");
      setSignedUrls({});
      setDownloadError(null);
      return;
    }
    setFeedback(selected.feedback ?? "");
    setGrade(selected.grade != null ? String(selected.grade) : "");
    setSignedUrls({});
    setDownloadError(null);
  }, [selected]);

  useEffect(() => {
    if (!evalState?.ok) return;
    setSelectedId(null);
    router.refresh();
  }, [evalState, router]);

  useEffect(() => {
    if (!selected) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  function openStation(item: GradingQueueItem) {
    setSelectedId(item.id);
  }

  function closeStation() {
    setSelectedId(null);
  }

  function requestDownload(submissionId: string, storagePath: string) {
    const cacheKey = `${submissionId}:${storagePath}`;
    if (signedUrls[cacheKey]) {
      window.open(signedUrls[cacheKey], "_blank", "noopener,noreferrer");
      return;
    }

    startDownload(async () => {
      setDownloadError(null);
      const result = await getSubmissionDownloadUrl(submissionId, storagePath);
      if (result.error || !result.url) {
        setDownloadError(result.error ?? "Download unavailable.");
        return;
      }
      setSignedUrls((prev) => ({ ...prev, [cacheKey]: result.url! }));
      window.open(result.url, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total pending homework"
          value={metrics.pendingHomework}
          hint="Submitted work awaiting your evaluation"
        />
        <StatCard
          label="Graded this week"
          value={metrics.gradedThisWeek}
          hint="Scores logged in the last 7 days"
        />
        <StatCard
          label="Return / revision queue"
          value={metrics.revisionQueue}
          hint="Submissions sent back for student rework"
        />
      </div>

      <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-slate-900">Evaluation queue</h2>
          <p className="mt-1 text-sm text-slate-600">
            Filter by course, status, or student name. Open a row to launch the grading
            station.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:flex-wrap sm:items-end sm:px-6">
          <div className="min-w-[10rem] flex-1">
            <label
              htmlFor="grading-search"
              className="block text-xs font-bold uppercase tracking-widest text-slate-500"
            >
              Search
            </label>
            <input
              id="grading-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Student, course, lesson…"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="min-w-[10rem]">
            <label
              htmlFor="grading-status"
              className="block text-xs font-bold uppercase tracking-widest text-slate-500"
            >
              Status
            </label>
            <select
              id="grading-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | SubmissionStatus)
              }
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            >
              {STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[10rem]">
            <label
              htmlFor="grading-course"
              className="block text-xs font-bold uppercase tracking-widest text-slate-500"
            >
              Course
            </label>
            <select
              id="grading-course"
              value={courseFilter}
              onChange={(event) => setCourseFilter(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All assigned courses</option>
              {courseOptions.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-semibold text-slate-900">No submissions match your filters</p>
            <p className="mt-2 text-sm text-slate-600">
              {items.length === 0
                ? "Once students submit homework in your assigned courses, entries appear here."
                : "Try clearing filters or selecting a different course."}
            </p>
            <Link
              href="/teacher"
              className="mt-6 inline-flex text-sm font-semibold text-indigo-600 transition-all duration-200 hover:text-indigo-800 active:scale-[0.98]"
            >
              ← Back to teacher home
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-white text-xs font-bold uppercase tracking-widest text-slate-500">
                  <th className="px-5 py-3 sm:px-6">Student</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Lesson</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right sm:px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-5 py-4 font-semibold text-slate-900 sm:px-6">
                      {item.studentName}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{item.courseTitle}</td>
                    <td className="px-5 py-4 text-slate-700">
                      {item.lessonTitle ?? "—"}
                    </td>
                    <td className="px-5 py-4 tabular-nums text-slate-600">
                      {formatDate(item.submittedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ring-inset ${statusBadgeClass(item.status)}`}
                      >
                        {statusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right sm:px-6">
                      <button
                        type="button"
                        onClick={() => openStation(item)}
                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60"
                      >
                        Evaluate submission
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-[2px]"
          role="presentation"
          onClick={closeStation}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="grading-station-title"
            className="flex h-full w-full max-w-6xl flex-col border-l border-slate-200 bg-[#fafafa] shadow-2xl sm:max-w-[min(100%,72rem)]"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  Grading station
                </p>
                <h2
                  id="grading-station-title"
                  className="mt-1 text-xl font-extrabold text-slate-900"
                >
                  {selected.studentName}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {selected.courseTitle}
                  {selected.lessonTitle ? ` · ${selected.lessonTitle}` : null}
                </p>
              </div>
              <button
                type="button"
                onClick={closeStation}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
              >
                Close
              </button>
            </header>

            <div className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-2">
              <section className="overflow-y-auto border-b border-slate-200 bg-white p-5 sm:p-6 lg:border-b-0 lg:border-r">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                  Asset box
                </h3>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                  <p className="text-lg font-bold text-slate-900">{selected.assignmentTitle}</p>
                  {selected.assignmentDescription ? (
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {selected.assignmentDescription}
                    </p>
                  ) : null}
                  <dl className="mt-4 grid gap-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">Max points</dt>
                      <dd className="font-semibold text-slate-900">{selected.maxPoints}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">Submitted</dt>
                      <dd className="font-medium text-slate-900 tabular-nums">
                        {formatDate(selected.submittedAt)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">Status</dt>
                      <dd>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ring-inset ${statusBadgeClass(selected.status)}`}
                        >
                          {statusLabel(selected.status)}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <h4 className="mt-8 text-sm font-bold text-slate-900">Student files</h4>
                {downloadError ? (
                  <p className="mt-2 text-sm text-rose-700" role="alert">
                    {downloadError}
                  </p>
                ) : null}
                {selected.storagePaths.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-600">
                    No files were attached to this submission.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {selected.storagePaths.map((file) => (
                      <li key={file.path}>
                        <button
                          type="button"
                          disabled={downloadPending}
                          onClick={() => requestDownload(selected.id, file.path)}
                          className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60"
                        >
                          <span
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"
                            aria-hidden
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 10v6m0 0l-3-3m3 3l3-3M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2h-3.5a1.5 1.5 0 01-3 0H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold text-slate-900">
                              {file.name}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                              {formatFileSize(file.size)} · Secure signed link (1 hour)
                            </span>
                          </span>
                          <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-indigo-600">
                            Download
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="overflow-y-auto p-5 sm:p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                  Grading panel
                </h3>
                <form action={evalAction} className="mt-4 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <input type="hidden" name="submission_id" value={selected.id} />
                  <ActionBanner state={evalState} />

                  <div>
                    <label
                      htmlFor="grading-feedback"
                      className="block text-xs font-bold uppercase tracking-widest text-slate-500"
                    >
                      Instructor feedback markup &amp; action steps
                    </label>
                    <textarea
                      id="grading-feedback"
                      name="feedback"
                      rows={8}
                      value={feedback}
                      onChange={(event) => setFeedback(event.target.value)}
                      placeholder="Strengths, corrections, and next steps for the learner…"
                      className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="grading-score"
                      className="block text-xs font-bold uppercase tracking-widest text-slate-500"
                    >
                      Numeric score (0 – 100)
                    </label>
                    <input
                      id="grading-score"
                      name="grade"
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={grade}
                      onChange={(event) => setGrade(event.target.value)}
                      className="mt-2 w-full max-w-[8rem] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm tabular-nums text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:flex-wrap">
                    <button
                      type="submit"
                      name="intent"
                      value="grade"
                      disabled={evalPending}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                    >
                      {evalPending ? "Saving…" : "Approve & log grade"}
                    </button>
                    <button
                      type="submit"
                      name="intent"
                      value="return"
                      disabled={evalPending}
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                    >
                      Request student revision
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
