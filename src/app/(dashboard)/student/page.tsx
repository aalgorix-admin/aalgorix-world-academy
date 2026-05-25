import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  computeProgressPercent,
  fetchCompletedLessonsByEnrollment,
  fetchLessonTotalsByCourse,
} from "@/lib/dashboard/course-progress";
import { unwrapOne } from "@/lib/dashboard/relations";
import {
  isSubmissionStatus,
  submissionStatusBadgeClass,
  submissionStatusLabel,
  type SubmissionStatus,
} from "@/lib/dashboard/submission-status";
import { fetchFirstLessonIdForCourse } from "@/lib/student/workspace";
import { createClient } from "@/lib/supabase/server";

import { RevisionAlertRibbon } from "./revision-alert-ribbon";

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  curriculum_tag: string | null;
  grade_level: string | null;
  thumbnail_url: string | null;
};

type RawSubmissionMetricRow = {
  status: string;
  grade: number | null;
};

type RawFeedbackRow = {
  id: string;
  status: string;
  grade: number | null;
  feedback: string | null;
  graded_at: string | null;
  submitted_at: string | null;
  updated_at: string;
  assignments: {
    course_id: string;
    lesson_id: string | null;
    title: string;
    courses: { id: string; title: string } | { id: string; title: string }[] | null;
    lessons: { id: string; title: string } | { id: string; title: string }[] | null;
  } | {
    course_id: string;
    lesson_id: string | null;
    title: string;
    courses: { id: string; title: string } | { id: string; title: string }[] | null;
    lessons: { id: string; title: string } | { id: string; title: string }[] | null;
  }[] | null;
};

type FeedbackEntry = {
  id: string;
  status: SubmissionStatus;
  grade: number | null;
  feedback: string | null;
  courseId: string;
  courseTitle: string;
  lessonId: string | null;
  lessonTitle: string;
  assignmentTitle: string;
  sortTimestamp: number;
};

type CourseCardMeta = {
  enrollmentId: string;
  course: CourseRow;
  progressPercent: number;
  totalLessons: number;
  classroomHref: string | null;
};

function formatTodayDate(): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function feedbackSortTimestamp(row: RawFeedbackRow): number {
  const iso = row.graded_at ?? row.submitted_at ?? row.updated_at;
  return iso ? new Date(iso).getTime() : 0;
}

function averageRounded(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function normalizeFeedbackEntry(row: RawFeedbackRow): FeedbackEntry | null {
  if (!isSubmissionStatus(row.status)) return null;
  if (row.status !== "graded" && row.status !== "returned") return null;

  const assignment = unwrapOne(row.assignments);
  if (!assignment) return null;

  const course = unwrapOne(assignment.courses);
  const lesson = unwrapOne(assignment.lessons);
  const courseId = course?.id ?? assignment.course_id;

  return {
    id: row.id,
    status: row.status,
    grade: row.grade,
    feedback: row.feedback,
    courseId,
    courseTitle: course?.title ?? "Course",
    lessonId: lesson?.id ?? assignment.lesson_id,
    lessonTitle: lesson?.title ?? assignment.title,
    assignmentTitle: assignment.title,
    sortTimestamp: feedbackSortTimestamp(row),
  };
}

export default async function StudentHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/student");
  }

  const [
    { data: profile },
    { data: enrollmentRows },
    { data: metricSubmissionRows },
    { data: feedbackSubmissionRows },
    { count: returnedRevisionCount },
  ] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase
      .from("enrollments")
      .select(
        `
        id,
        courses (
          id,
          title,
          slug,
          curriculum_tag,
          grade_level,
          thumbnail_url
        )
      `,
      )
      .eq("student_id", user.id)
      .eq("status", "active"),
    supabase
      .from("submissions")
      .select("status, grade")
      .eq("student_id", user.id)
      .in("status", ["graded", "returned"]),
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
        updated_at,
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
      .order("updated_at", { ascending: false })
      .limit(12),
    supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("student_id", user.id)
      .eq("status", "returned"),
  ]);

  const enrollments =
    enrollmentRows?.flatMap((row) => {
      const course = unwrapOne(row.courses as CourseRow | CourseRow[] | null);
      if (!course) return [];
      return [{ enrollmentId: row.id, course }];
    }) ?? [];

  const enrollmentIds = enrollments.map((row) => row.enrollmentId);
  const courseIds = enrollments.map((row) => row.course.id);

  const [lessonTotals, completedByEnrollment] = await Promise.all([
    fetchLessonTotalsByCourse(supabase, courseIds),
    fetchCompletedLessonsByEnrollment(supabase, enrollmentIds),
  ]);

  const coursesWithMeta: CourseCardMeta[] = await Promise.all(
    enrollments.map(async ({ enrollmentId, course }) => {
      const totalLessons = lessonTotals.get(course.id) ?? 0;
      const completedLessons = completedByEnrollment.get(enrollmentId) ?? 0;
      const progressPercent = computeProgressPercent(
        completedLessons,
        totalLessons,
      );
      const lessonId =
        (await fetchFirstLessonIdForCourse(course.id)) ?? null;
      const classroomHref = lessonId
        ? `/student/courses/${course.id}/lessons/${lessonId}`
        : null;

      return {
        enrollmentId,
        course,
        progressPercent,
        totalLessons,
        classroomHref,
      };
    }),
  );

  const progressValues = coursesWithMeta.map((row) => row.progressPercent);
  const averageCourseProgress =
    progressValues.length > 0 ? averageRounded(progressValues) ?? 0 : 0;

  const completedLessonsTotal = [...completedByEnrollment.values()].reduce(
    (sum, count) => sum + count,
    0,
  );

  const gradedScores = ((metricSubmissionRows ?? []) as RawSubmissionMetricRow[])
    .filter((row) => row.status === "graded" && row.grade != null)
    .map((row) => row.grade as number);

  const gpaAverage = averageRounded(gradedScores);
  const actionItems = returnedRevisionCount ?? 0;

  const recentFeedback = ((feedbackSubmissionRows ?? []) as RawFeedbackRow[])
    .map(normalizeFeedbackEntry)
    .filter((entry): entry is FeedbackEntry => entry !== null)
    .sort((a, b) => b.sortTimestamp - a.sortTimestamp)
    .slice(0, 3);

  const feedbackWithHrefs = await Promise.all(
    recentFeedback.map(async (entry) => {
      const lessonId =
        entry.lessonId ?? (await fetchFirstLessonIdForCourse(entry.courseId));
      return {
        ...entry,
        workspaceHref: lessonId
          ? `/student/courses/${entry.courseId}/lessons/${lessonId}`
          : null,
      };
    }),
  );

  const displayName = profile?.full_name?.trim() || "Student";
  const todayLabel = formatTodayDate();

  return (
    <DashboardShell
      eyebrow="Student workspace"
      title="Learning dashboard"
      subtitle="Track progress, review instructor feedback, and continue your enrolled classrooms."
    >
      <section
        aria-label="Welcome greeting"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <time
              dateTime={new Date().toISOString().slice(0, 10)}
              className="text-sm font-semibold text-slate-500"
            >
              {todayLabel}
            </time>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back, {displayName}
            </h2>
            <p className="mt-2 max-w-xl text-base text-slate-600">
              Your live academic snapshot updates as you complete lessons and receive
              graded feedback from instructors.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            <Link
              href="/student/notifications"
              className="relative inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
            >
              View grade &amp; feedback alerts
              {actionItems > 0 ? (
                <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {actionItems}
                </span>
              ) : null}
            </Link>
            <Link
              href="/student/profile"
              className="inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-800 px-4 py-3 text-center text-sm font-bold text-slate-900 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 sm:w-auto"
            >
              Manage Profile &amp; Parent Connection Code
            </Link>
          </div>
        </div>

        <RevisionAlertRibbon count={actionItems} />
      </section>

      <section
        aria-label="Global academic performance metrics"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Average Course Progress"
          value={`${averageCourseProgress}%`}
          hint="Mean completion across active enrollments"
        />
        <StatCard
          label="Completed Lessons"
          value={completedLessonsTotal}
          hint="Lessons marked complete in lesson_progress"
        />
        <StatCard
          label="GPA Average Score"
          value={gpaAverage != null ? `${gpaAverage}%` : "—"}
          hint="Mean of graded submission scores (0–100)"
        />
        <StatCard
          label="Action Items"
          value={actionItems}
          hint="Returned submissions awaiting your revision"
        />
      </section>

      <div className="mt-10 grid gap-8 xl:grid-cols-3">
        <section
          aria-labelledby="enrolled-courses-heading"
          className="xl:col-span-2"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2
              id="enrolled-courses-heading"
              className="text-lg font-extrabold tracking-tight text-slate-900"
            >
              Enrolled course matrix
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Active tracks with live lesson progress from your classroom enrollments.
            </p>

            {coursesWithMeta.length > 0 ? (
              <ul className="mt-6 grid gap-6 sm:grid-cols-2">
                {coursesWithMeta.map(
                  ({ course, progressPercent, totalLessons, classroomHref }) => {
                    const tags = [
                      course.grade_level,
                      course.curriculum_tag,
                    ].filter(Boolean) as string[];

                    return (
                      <li
                        key={course.id}
                        className="flex flex-col rounded-2xl border border-slate-200 bg-[#fafafa] p-5 transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100">
                          {course.thumbnail_url ? (
                            // eslint-disable-next-line @next/next/no-img-element -- dynamic Supabase / external URLs
                            <img
                              src={course.thumbnail_url}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-4xl font-extrabold text-indigo-300">
                              {course.title.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex flex-1 flex-col">
                          {tags.length > 0 ? (
                            <div className="mb-2 flex flex-wrap gap-2">
                              {course.grade_level ? (
                                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-white">
                                  {course.grade_level}
                                </span>
                              ) : null}
                              {course.curriculum_tag ? (
                                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 ring-1 ring-inset ring-indigo-200">
                                  {course.curriculum_tag}
                                </span>
                              ) : null}
                            </div>
                          ) : null}

                          <h3 className="text-lg font-bold text-slate-900">
                            {course.title}
                          </h3>

                          <div className="mt-4">
                            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600">
                              <span>Lesson progress</span>
                              <span className="tabular-nums text-slate-900">
                                {progressPercent}%
                              </span>
                            </div>
                            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <p className="mt-1.5 text-xs text-slate-500">
                              {totalLessons > 0
                                ? `${progressPercent}% of syllabus complete`
                                : "Syllabus publishing in progress"}
                            </p>
                          </div>

                          {classroomHref ? (
                            <Link
                              href={classroomHref}
                              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 active:scale-[0.98]"
                            >
                              Open classroom workspace
                            </Link>
                          ) : (
                            <p className="mt-5 text-center text-xs font-medium text-slate-500">
                              Classroom publishing soon
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  },
                )}
              </ul>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <p className="text-base font-semibold text-slate-900">
                  No active enrollments yet
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Explore published curricula while your administrator completes
                  enrollment.
                </p>
                <Link
                  href="/courses"
                  className="mt-4 inline-flex items-center justify-center rounded-xl border-2 border-slate-800 px-4 py-2.5 text-sm font-bold text-slate-900 transition-all duration-200 hover:bg-white active:scale-[0.98]"
                >
                  Browse open curricula
                </Link>
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="feedback-stream-heading" className="xl:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2
              id="feedback-stream-heading"
              className="text-lg font-extrabold tracking-tight text-slate-900"
            >
              Recent Grading &amp; Instructor Feedback
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Latest graded scores and revision notes from your teachers.
            </p>

            {feedbackWithHrefs.length > 0 ? (
              <ol className="mt-6 space-y-5">
                {feedbackWithHrefs.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-xl border border-slate-200 bg-[#fafafa] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                          {entry.courseTitle}
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {entry.lessonTitle}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {entry.assignmentTitle}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ring-inset ${submissionStatusBadgeClass(entry.status)}`}
                        >
                          {submissionStatusLabel(entry.status)}
                        </span>
                        {entry.status === "graded" && entry.grade != null ? (
                          <span className="text-sm font-extrabold tabular-nums text-emerald-800">
                            {entry.grade} / 100
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <blockquote className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Instructor comments
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-800">
                        {entry.feedback?.trim() ||
                          "No written feedback was provided for this entry."}
                      </p>
                    </blockquote>

                    {entry.workspaceHref ? (
                      <Link
                        href={entry.workspaceHref}
                        className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-slate-800 px-3 py-2 text-sm font-bold text-slate-900 transition-all duration-200 hover:bg-white active:scale-[0.98]"
                      >
                        Open Lesson to Revise Workspace
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                <p className="text-sm font-semibold text-slate-900">
                  No grading activity yet
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  Submit assignments from your classroom lessons. Graded and returned
                  work will appear here.
                </p>
                {coursesWithMeta[0]?.classroomHref ? (
                  <Link
                    href={coursesWithMeta[0].classroomHref}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-[0.98]"
                  >
                    Go to your classroom
                  </Link>
                ) : (
                  <Link
                    href="/courses"
                    className="mt-4 inline-flex items-center justify-center rounded-xl border-2 border-slate-800 px-4 py-2 text-xs font-bold text-slate-900 transition-all duration-200 hover:bg-white active:scale-[0.98]"
                  >
                    Explore open curricula
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
