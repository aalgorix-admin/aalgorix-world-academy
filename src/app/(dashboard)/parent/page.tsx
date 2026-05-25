import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  computeProgressPercent,
  fetchCompletedLessonsByEnrollment,
  fetchLessonTotalsByCourse,
} from "@/lib/dashboard/course-progress";
import { unwrapOne } from "@/lib/dashboard/relations";
import { getDashboardPathForRole } from "@/lib/auth/redirects";
import { isUserRole } from "@/lib/auth/roles";
import { isSubmissionStatus } from "@/lib/dashboard/submission-status";
import { createClient } from "@/lib/supabase/server";

import { ChildNav } from "./child-nav";
import { CourseProgressPanel } from "./course-progress-panel";
import { GradingTimeline } from "./grading-timeline";
import { ScholasticSummaryPanel } from "./scholastic-summary";
import type {
  CourseEnrollmentProgress,
  GradingTimelineEntry,
  LinkedChild,
  ScholasticSummary,
  StoragePathEntry,
} from "./types";

type ChildProfile = {
  id: string;
  full_name: string | null;
  email: string;
};

type CourseSummary = {
  id: string;
  title: string;
  curriculum_tag: string | null;
};

type RawSubmissionRow = {
  id: string;
  status: string;
  grade: number | null;
  feedback: string | null;
  graded_at: string | null;
  submitted_at: string | null;
  storage_paths: unknown;
  assignments: {
    title: string;
    courses: { title: string } | { title: string }[] | null;
    lessons: { title: string } | { title: string }[] | null;
  } | {
    title: string;
    courses: { title: string } | { title: string }[] | null;
    lessons: { title: string } | { title: string }[] | null;
  }[] | null;
};

type PageProps = {
  searchParams: Promise<{ child?: string }>;
};

function parseStoragePaths(raw: unknown): StoragePathEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (entry): entry is StoragePathEntry =>
      typeof entry === "object" &&
      entry !== null &&
      "path" in entry &&
      "name" in entry &&
      typeof (entry as StoragePathEntry).path === "string" &&
      typeof (entry as StoragePathEntry).name === "string",
  );
}

function normalizeTimelineEntry(row: RawSubmissionRow): GradingTimelineEntry | null {
  if (!isSubmissionStatus(row.status) || row.status === "draft") return null;

  const assignment = unwrapOne(row.assignments);
  if (!assignment) return null;

  const course = unwrapOne(assignment.courses);
  const lesson = unwrapOne(assignment.lessons);

  return {
    id: row.id,
    status: row.status,
    grade: row.grade,
    feedback: row.feedback,
    gradedAt: row.graded_at,
    submittedAt: row.submitted_at,
    courseTitle: course?.title ?? "Course",
    lessonTitle: lesson?.title ?? null,
    assignmentTitle: assignment.title,
    storagePaths: parseStoragePaths(row.storage_paths),
  };
}

function timelineSortTimestamp(entry: GradingTimelineEntry): number {
  const iso = entry.gradedAt ?? entry.submittedAt;
  return iso ? new Date(iso).getTime() : 0;
}

function buildScholasticSummary(
  completionPercent: number,
  timeline: GradingTimelineEntry[],
): ScholasticSummary {
  const gradedWithScores = timeline.filter(
    (entry) => entry.status === "graded" && entry.grade != null,
  );

  const averageGrade =
    gradedWithScores.length > 0
      ? Math.round(
          gradedWithScores.reduce((sum, entry) => sum + (entry.grade ?? 0), 0) /
            gradedWithScores.length,
        )
      : null;

  return {
    completionPercent,
    assignmentsSubmitted: timeline.length,
    averageGrade,
    pendingRevisions: timeline.filter((entry) => entry.status === "returned").length,
  };
}

export default async function ParentHomePage({ searchParams }: PageProps) {
  const { child: childParam } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/parent");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "parent") {
    const destination =
      profile?.role && isUserRole(profile.role)
        ? getDashboardPathForRole(profile.role)
        : "/login";
    redirect(destination);
  }

  const { data: relationRows } = await supabase
    .from("student_parent_relations")
    .select(
      `
      student_id,
      relationship_label,
      student:profiles!student_id (
        id,
        full_name,
        email
      )
    `,
    )
    .eq("parent_id", user.id);

  const children: LinkedChild[] =
    relationRows?.flatMap((row) => {
      const child = unwrapOne(
        row.student as ChildProfile | ChildProfile[] | null,
      );
      if (!child) return [];
      return [
        {
          ...child,
          relationshipLabel: row.relationship_label ?? "Child",
        },
      ];
    }) ?? [];

  if (children.length > 0) {
    const validatedChildId = children.some((child) => child.id === childParam)
      ? childParam!
      : children[0].id;

    if (childParam !== validatedChildId) {
      redirect(`/parent?child=${validatedChildId}`);
    }
  }

  const activeChildId =
    childParam && children.some((child) => child.id === childParam)
      ? childParam
      : null;

  const activeChild = children.find((child) => child.id === activeChildId) ?? null;

  let enrollments: CourseEnrollmentProgress[] = [];
  let timeline: GradingTimelineEntry[] = [];
  let completionPercent = 0;

  if (activeChildId) {
    const [{ data: enrollmentRows }, { data: submissionRows }] = await Promise.all([
      supabase
        .from("enrollments")
        .select(
          `
          id,
          courses (
            id,
            title,
            curriculum_tag
          )
        `,
        )
        .eq("student_id", activeChildId)
        .eq("status", "active"),
      supabase
        .from("submissions")
        .select(
          `
          id,
          status,
          grade,
          feedback,
          graded_at,
          submitted_at,
          storage_paths,
          assignments (
            title,
            courses (
              title
            ),
            lessons (
              title
            )
          )
        `,
        )
        .eq("student_id", activeChildId)
        .neq("status", "draft"),
    ]);

    const childEnrollments =
      enrollmentRows?.flatMap((row) => {
        const course = unwrapOne(
          row.courses as CourseSummary | CourseSummary[] | null,
        );
        if (!course) return [];
        return [{ enrollmentId: row.id, course }];
      }) ?? [];

    const enrollmentIds = childEnrollments.map((row) => row.enrollmentId);
    const courseIds = childEnrollments.map((row) => row.course.id);

    const [lessonTotals, completedByEnrollment] = await Promise.all([
      fetchLessonTotalsByCourse(supabase, courseIds),
      fetchCompletedLessonsByEnrollment(supabase, enrollmentIds),
    ]);

    enrollments = childEnrollments.map(({ enrollmentId, course }) => {
      const total = lessonTotals.get(course.id) ?? 0;
      const completed = completedByEnrollment.get(enrollmentId) ?? 0;
      return {
        enrollmentId,
        course,
        progressPercent: computeProgressPercent(completed, total),
      };
    });

    if (enrollments.length > 0) {
      completionPercent = Math.round(
        enrollments.reduce((sum, row) => sum + row.progressPercent, 0) /
          enrollments.length,
      );
    }

    timeline = ((submissionRows ?? []) as RawSubmissionRow[])
      .map(normalizeTimelineEntry)
      .filter((entry): entry is GradingTimelineEntry => entry !== null)
      .sort((a, b) => timelineSortTimestamp(b) - timelineSortTimestamp(a));
  }

  const summary = buildScholasticSummary(completionPercent, timeline);
  const displayName = profile?.full_name?.trim() || "Parent";
  const learnerName = activeChild?.full_name?.trim() || activeChild?.email || "Learner";

  return (
    <DashboardShell
      eyebrow="Parent performance monitoring"
      title={`Welcome Back, ${displayName}`}
      subtitle="Transparent scholastic oversight across linked learners—progress, grades, and teacher feedback in one place."
    >
      {children.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-base font-semibold text-slate-900">
            No linked students yet
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Ask your child to generate a link code in their academic passport, then enter it
            in{" "}
            <a href="/parent/settings" className="font-medium text-indigo-600 hover:underline">
              parent settings
            </a>
            .
          </p>
        </div>
      ) : activeChild && activeChildId ? (
        <>
          <ChildNav linkedChildren={children} activeChildId={activeChildId} />

          <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <header className="border-b border-slate-100 pb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                {activeChild.relationshipLabel}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                {learnerName}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{activeChild.email}</p>
            </header>

            <Link
              href={`/parent/report-card/${activeChildId}`}
              className="mt-6 flex w-full items-center gap-4 rounded-xl border-2 border-slate-800 bg-white px-5 py-4 text-left shadow-sm transition-all duration-200 hover:border-slate-900 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] print:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                aria-hidden
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12h6M9 16h6M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
                  <path d="M14 3v5h5" />
                  <path d="M8 7.5h2" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">
                  View Official Academic Transcript
                </span>
                <span className="mt-0.5 block text-xs text-slate-600 sm:text-sm">
                  Print-ready report card and graded assessment record
                </span>
              </span>
              <span
                className="hidden shrink-0 text-slate-400 sm:inline"
                aria-hidden
              >
                →
              </span>
            </Link>

            <div className="mt-8">
              <ScholasticSummaryPanel summary={summary} learnerName={learnerName} />
            </div>

            <div className="mt-10">
              <CourseProgressPanel enrollments={enrollments} />
            </div>

            <div className="mt-10">
              <GradingTimeline entries={timeline} />
            </div>
          </div>
        </>
      ) : null}
    </DashboardShell>
  );
}
