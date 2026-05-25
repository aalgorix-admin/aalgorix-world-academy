import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { isUserRole, type UserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

import { StaffingPanel } from "./staffing-panel";
import type {
  PublishedCourseOption,
  StaffingPageData,
  StaffProfile,
  TeacherCourseAssignment,
} from "./types";

type RawAssignment = {
  teacher_id: string;
  course_id: string;
  assigned_at: string;
  courses: PublishedCourseOption | PublishedCourseOption[] | null;
};

export default async function AdminStaffingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin/staffing");
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    redirect("/admin");
  }

  const [
    { data: profileRows, error: profilesError },
    { data: courseRows, error: coursesError },
    { data: assignmentRows, error: assignmentsError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("courses")
      .select("id, slug, title, grade_level, curriculum_tag")
      .eq("is_published", true)
      .order("title", { ascending: true }),
    supabase
      .from("teacher_course_assignments")
      .select(
        `
        teacher_id,
        course_id,
        assigned_at,
        courses (
          id,
          slug,
          title,
          grade_level,
          curriculum_tag
        )
      `,
      )
      .order("assigned_at", { ascending: false }),
  ]);

  if (profilesError || coursesError || assignmentsError) {
    const message =
      profilesError?.message ?? coursesError?.message ?? assignmentsError?.message;

    return (
      <DashboardShell
        eyebrow="Phase 7 · Staffing"
        title="Staffing registry"
        subtitle="Administrative staffing and course allocation controls."
      >
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Could not load staffing data: {message}
        </p>
        <Link
          href="/admin"
          className="mt-4 inline-block text-sm font-medium text-indigo-600"
        >
          ← Admin home
        </Link>
      </DashboardShell>
    );
  }

  const profiles: StaffProfile[] = (profileRows ?? [])
    .filter((row): row is typeof row & { role: UserRole } => isUserRole(row.role))
    .map((row) => ({
      id: row.id,
      full_name: row.full_name,
      email: row.email,
      role: row.role,
      created_at: row.created_at,
    }));

  const publishedCourses: PublishedCourseOption[] = courseRows ?? [];

  const assignments: TeacherCourseAssignment[] = (assignmentRows ?? [])
    .flatMap((row: RawAssignment) => {
      const nested = row.courses;
      const course = Array.isArray(nested) ? nested[0] : nested;
      if (!course) return [];
      return [
        {
          teacher_id: row.teacher_id,
          course_id: row.course_id,
          assigned_at: row.assigned_at,
          course,
        },
      ];
    });

  const data: StaffingPageData = {
    profiles,
    publishedCourses,
    assignments,
  };

  const teacherCount = profiles.filter((p) => p.role === "teacher").length;
  const linkedTeachers = new Set(assignments.map((a) => a.teacher_id)).size;

  return (
    <DashboardShell
      eyebrow="Phase 7 · Staffing"
      title="Staffing & course allocation"
      subtitle="Registry monitor for every account in the tenant. Link published courses to teachers via teacher_course_assignments."
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Registered accounts
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
            {profiles.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Teacher profiles
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
            {teacherCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Teachers with allocations
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
            {linkedTeachers}
          </p>
        </div>
      </div>

      <StaffingPanel data={data} />
    </DashboardShell>
  );
}
