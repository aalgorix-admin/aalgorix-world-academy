import Link from "next/link";

import { ActionCard } from "@/components/dashboard/action-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { unwrapOne } from "@/lib/dashboard/relations";
import { createClient } from "@/lib/supabase/server";

type AssignedCourse = {
  id: string;
  title: string;
  curriculum_tag: string | null;
};

export default async function TeacherHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: assignmentRows } = await supabase
    .from("teacher_course_assignments")
    .select(
      `
      course_id,
      courses (
        id,
        title,
        curriculum_tag
      )
    `,
    )
    .eq("teacher_id", user.id);

  const assignedCourses =
    assignmentRows?.flatMap((row) => {
      const course = unwrapOne(
        row.courses as AssignedCourse | AssignedCourse[] | null,
      );
      if (!course) return [];
      return [course];
    }) ?? [];

  const courseIds = assignedCourses.map((course) => course.id);

  let pendingSubmissions = 0;
  let totalEnrolledStudents = 0;

  if (courseIds.length > 0) {
    const { data: courseAssignments } = await supabase
      .from("assignments")
      .select("id")
      .in("course_id", courseIds);

    const assignmentIds = (courseAssignments ?? []).map((row) => row.id);

    const [{ count: pendingCount }, { count: enrollmentCount }] =
      await Promise.all([
        assignmentIds.length > 0
          ? supabase
              .from("submissions")
              .select("*", { count: "exact", head: true })
              .eq("status", "submitted")
              .in("assignment_id", assignmentIds)
          : Promise.resolve({ count: 0 }),
        supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")
          .in("course_id", courseIds),
      ]);

    pendingSubmissions = pendingCount ?? 0;
    totalEnrolledStudents = enrollmentCount ?? 0;
  }

  const displayName = profile?.full_name?.trim() || "Educator";

  return (
    <DashboardShell
      eyebrow="Teacher command center"
      title={`Welcome Back, ${displayName}`}
      subtitle="Monitor assigned courses, enrollment reach, and submissions awaiting your evaluation."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Assigned courses"
          value={assignedCourses.length}
          hint="Courses linked to your teaching profile"
        />
        <StatCard
          label="Total enrolled students"
          value={totalEnrolledStudents}
          hint="Active enrollments across your assigned catalog"
        />
        <StatCard
          label="Submissions requiring attention"
          value={pendingSubmissions}
          hint="Submitted work awaiting grading"
        />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">Quick actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ActionCard
            href="/teacher/grading"
            title="Open grading queue"
            description="Review submitted assignments, apply scores, and return written feedback within the academy SLA."
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
          />
          <ActionCard
            href="/courses"
            title="Browse published catalog"
            description="Reference published curriculum structure, modules, and lesson sequencing across the academy."
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path strokeLinecap="round" d="M4 19h16M4 5h16M4 12h10" />
              </svg>
            }
          />
        </div>
      </section>

      {assignedCourses.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">Your assigned courses</h2>
          <ul className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {assignedCourses.map((course) => (
              <li
                key={course.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">{course.title}</p>
                  {course.curriculum_tag ? (
                    <p className="mt-0.5 text-xs font-medium text-indigo-700">
                      {course.curriculum_tag}
                    </p>
                  ) : null}
                </div>
                <Link
                  href="/teacher/grading"
                  className="shrink-0 text-sm font-semibold text-indigo-600 transition-all duration-200 hover:text-indigo-800 active:scale-[0.98]"
                >
                  Grade →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <p className="font-semibold text-slate-900">No course assignments yet</p>
          <p className="mt-2 text-sm text-slate-600">
            An administrator must link your profile to courses in{" "}
            <code className="text-xs">teacher_course_assignments</code>.
          </p>
        </div>
      )}
    </DashboardShell>
  );
}
