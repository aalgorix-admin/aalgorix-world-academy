import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardPathForRole } from "@/lib/auth/redirects";
import { isUserRole } from "@/lib/auth/roles";
import { unwrapOne } from "@/lib/dashboard/relations";
import {
  isSubmissionStatus,
  type SubmissionStatus,
} from "@/lib/dashboard/submission-status";
import { createClient } from "@/lib/supabase/server";

type RawNotificationRow = {
  id: string;
  status: string;
  grade: number | null;
  feedback: string | null;
  updated_at: string;
  graded_at: string | null;
  grader:
    | { full_name: string | null }
    | { full_name: string | null }[]
    | null;
  assignments:
    | {
        course_id: string;
        lesson_id: string | null;
        title: string;
        courses:
          | { id: string; title: string }
          | { id: string; title: string }[]
          | null;
        lessons:
          | { id: string; title: string }
          | { id: string; title: string }[]
          | null;
      }
    | {
        course_id: string;
        lesson_id: string | null;
        title: string;
        courses:
          | { id: string; title: string }
          | { id: string; title: string }[]
          | null;
        lessons:
          | { id: string; title: string }
          | { id: string; title: string }[]
          | null;
      }[]
    | null;
};

type NotificationEntry = {
  id: string;
  status: SubmissionStatus;
  grade: number | null;
  feedback: string | null;
  updatedAt: string;
  teacherName: string;
  courseId: string;
  courseTitle: string;
  lessonId: string | null;
  lessonTitle: string;
  assignmentTitle: string;
  workspaceHref: string | null;
};

function formatNotificationTimestamp(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function teacherDisplayName(
  grader: RawNotificationRow["grader"],
): string {
  const profile = unwrapOne(grader);
  const name = profile?.full_name?.trim();
  return name && name.length > 0 ? name : "Your instructor";
}

function normalizeNotification(row: RawNotificationRow): NotificationEntry | null {
  if (!isSubmissionStatus(row.status)) return null;
  if (row.status !== "graded" && row.status !== "returned") return null;

  const assignment = unwrapOne(row.assignments);
  if (!assignment) return null;

  const course = unwrapOne(assignment.courses);
  const lesson = unwrapOne(assignment.lessons);
  const courseId = course?.id ?? assignment.course_id;
  const lessonId = lesson?.id ?? assignment.lesson_id;
  const lessonTitle = lesson?.title ?? assignment.title;

  const workspaceHref =
    lessonId != null
      ? `/student/courses/${courseId}/lessons/${lessonId}`
      : null;

  return {
    id: row.id,
    status: row.status,
    grade: row.grade,
    feedback: row.feedback,
    updatedAt: row.updated_at,
    teacherName: teacherDisplayName(row.grader),
    courseId,
    courseTitle: course?.title ?? "Course",
    lessonId,
    lessonTitle,
    assignmentTitle: assignment.title,
    workspaceHref,
  };
}

export default async function StudentNotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/student/notifications");
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileRow?.role !== "student") {
    const destination =
      profileRow?.role && isUserRole(profileRow.role)
        ? getDashboardPathForRole(profileRow.role)
        : "/login";
    redirect(destination);
  }

  const { data: submissionRows, error } = await supabase
    .from("submissions")
    .select(
      `
      id,
      status,
      grade,
      feedback,
      updated_at,
      graded_at,
      grader:profiles!graded_by (
        full_name
      ),
      assignments (
        course_id,
        lesson_id,
        title,
        courses (
          id,
          title
        ),
        lessons (
          id,
          title
        )
      )
    `,
    )
    .eq("student_id", user.id)
    .in("status", ["graded", "returned"])
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[student/notifications] submissions fetch failed:", error.message);
  }

  const notifications = ((submissionRows ?? []) as RawNotificationRow[])
    .map(normalizeNotification)
    .filter((entry): entry is NotificationEntry => entry !== null);

  const newScoresLogged = notifications.filter(
    (entry) => entry.status === "graded",
  ).length;
  const revisionsOutstanding = notifications.filter(
    (entry) => entry.status === "returned",
  ).length;

  return (
    <DashboardShell
      eyebrow="Student alert channel"
      title="Notification & grade update feed"
      subtitle="Chronological log of instructor scores, approval notices, and revision requests tied to your classroom submissions."
    >
      <Link
        href="/student"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-all duration-200 hover:text-indigo-800 active:scale-[0.98]"
      >
        <span aria-hidden>←</span>
        Back to learning dashboard
      </Link>

      <section
        aria-label="Alert analytics summary"
        className="grid gap-4 sm:grid-cols-2"
      >
        <StatCard
          label="New Scores Logged"
          value={newScoresLogged}
          hint="Graded submissions recorded by your instructors"
        />
        <StatCard
          label="Revisions Outstanding"
          value={revisionsOutstanding}
          hint="Returned work awaiting your revision desk response"
        />
      </section>

      <section
        aria-labelledby="notification-timeline-heading"
        className="mt-10"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2
            id="notification-timeline-heading"
            className="text-lg font-extrabold tracking-tight text-slate-900"
          >
            Academic event timeline
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Latest grading and revision signals, ordered by most recent activity.
          </p>

          {notifications.length > 0 ? (
            <ol className="mt-8 space-y-6">
              {notifications.map((entry) => (
                <li key={entry.id}>
                  {entry.status === "graded" ? (
                    <article
                      className="overflow-hidden rounded-2xl border border-slate-200 border-l-4 border-l-emerald-500 bg-[#fafafa] shadow-sm"
                      aria-label={`Graded score for ${entry.lessonTitle}`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                            Score approved
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-800">
                            Teacher{" "}
                            <span className="font-bold text-slate-900">
                              {entry.teacherName}
                            </span>{" "}
                            approved your assignment submission for lesson{" "}
                            <span className="font-bold text-slate-900">
                              {entry.lessonTitle}
                            </span>{" "}
                            in{" "}
                            <span className="font-bold text-slate-900">
                              {entry.courseTitle}
                            </span>
                            .
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {entry.assignmentTitle} ·{" "}
                            <time dateTime={entry.updatedAt}>
                              {formatNotificationTimestamp(entry.updatedAt)}
                            </time>
                          </p>
                        </div>
                        {entry.grade != null ? (
                          <div
                            className="inline-flex shrink-0 flex-col items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-white shadow-sm"
                            aria-label={`Score ${entry.grade} out of 100`}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
                              Score
                            </span>
                            <span className="text-2xl font-extrabold tabular-nums leading-none">
                              {entry.grade}
                              <span className="text-sm font-bold text-emerald-100">
                                /100
                              </span>
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <blockquote className="mx-5 my-5 rounded-xl border border-slate-200 bg-white px-4 py-3.5 sm:mx-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          Instructor review notes
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-800">
                          {entry.feedback?.trim() ||
                            "No written feedback was provided for this graded entry."}
                        </p>
                      </blockquote>

                      {entry.workspaceHref ? (
                        <div className="border-t border-slate-200 px-5 py-4 sm:px-6">
                          <Link
                            href={entry.workspaceHref}
                            className="inline-flex items-center justify-center rounded-xl border-2 border-slate-800 px-4 py-2.5 text-sm font-bold text-slate-900 transition-all duration-200 hover:bg-white active:scale-[0.98]"
                          >
                            View lesson workspace
                          </Link>
                        </div>
                      ) : null}
                    </article>
                  ) : (
                    <article
                      className="overflow-hidden rounded-2xl border border-rose-200 bg-[#fafafa] shadow-sm"
                      aria-label={`Revision required for ${entry.lessonTitle}`}
                    >
                      <div
                        role="alert"
                        className="border-b border-rose-200 bg-rose-600 px-5 py-4 text-white sm:px-6"
                      >
                        <p className="text-xs font-bold uppercase tracking-widest text-rose-100">
                          Action required
                        </p>
                        <p className="mt-1.5 text-sm font-bold leading-snug sm:text-base">
                          Action Required: Instructor requested revision updates
                          for {entry.lessonTitle}
                        </p>
                        <p className="mt-1 text-xs text-rose-100">
                          {entry.courseTitle} · {entry.assignmentTitle} ·{" "}
                          <time dateTime={entry.updatedAt}>
                            {formatNotificationTimestamp(entry.updatedAt)}
                          </time>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-900 ring-1 ring-inset ring-rose-200">
                            Revision
                          </span>
                          <span
                            className="text-2xl font-extrabold tabular-nums text-slate-400"
                            aria-hidden
                          >
                            —
                          </span>
                          <span className="sr-only">Grade pending revision</span>
                        </div>

                        {entry.workspaceHref ? (
                          <Link
                            href={entry.workspaceHref}
                            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-slate-800 active:scale-[0.98] sm:w-auto"
                          >
                            Open Revision Desk
                          </Link>
                        ) : (
                          <p className="text-sm font-medium text-slate-600">
                            Lesson workspace unavailable — contact your instructor.
                          </p>
                        )}
                      </div>

                      {entry.feedback?.trim() ? (
                        <blockquote className="mx-5 mb-5 rounded-xl border border-rose-200 bg-white px-4 py-3.5 sm:mx-6">
                          <p className="text-xs font-bold uppercase tracking-widest text-rose-700">
                            Revision guidance
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-800">
                            {entry.feedback}
                          </p>
                        </blockquote>
                      ) : null}
                    </article>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <p className="text-base font-semibold text-slate-900">
                Your academic record log is clear
              </p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
                Graded homework assignments and teacher feedback notes will populate
                here the moment they are marked by your instructors.
              </p>
              <Link
                href="/student"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 active:scale-[0.98]"
              >
                Return to learning dashboard
              </Link>
            </div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
