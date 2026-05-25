import Link from "next/link";

import { ActionCard } from "@/components/dashboard/action-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHomePage() {
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

  const [
    { count: profilesCount },
    { count: activeCoursesCount },
    { count: totalCoursesCount },
    { count: submissionsCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("submissions").select("*", { count: "exact", head: true }),
  ]);

  const displayName = profile?.full_name?.trim() || "Administrator";

  return (
    <DashboardShell
      eyebrow="Operations console"
      title={`Welcome Back, ${displayName}`}
      subtitle="Monitor platform-wide enrollment health and jump directly into curriculum administration."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Registered profiles"
          value={profilesCount ?? 0}
          hint="All roles across the academy tenant"
        />
        <StatCard
          label="Active published courses"
          value={activeCoursesCount ?? 0}
          hint="Catalog visible to learners"
        />
        <StatCard
          label="Total courses"
          value={totalCoursesCount ?? 0}
          hint="Including draft and unpublished"
        />
        <StatCard
          label="Total submissions"
          value={submissionsCount ?? 0}
          hint="All homework records in the instance"
        />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">Primary actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            href="/admin/staffing"
            title="Staffing & course allocation"
            description="Review every profile in the tenant and link published courses to teachers for grading scope."
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
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm11 11v-2a3 3 0 0 0-2-2.83M16 3.13a4 4 0 0 1 0 7.75"
                />
              </svg>
            }
          />
          <ActionCard
            href="/admin/courses"
            title="Course creation catalog"
            description="Create courses, attach modules, publish lessons, and manage the authoritative curriculum tree."
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path strokeLinecap="round" d="M12 6v12M6 12h12" />
              </svg>
            }
          />
          <ActionCard
            href="/courses"
            title="Published catalog preview"
            description="Review the learner-facing marketing and catalog presentation of published pathways."
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            }
          />
          <ActionCard
            href="/"
            title="Public marketing gateway"
            description="Open the live acquisition landing page served from the marketing route group."
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path strokeLinecap="round" d="M3 12h18M12 3v18" />
              </svg>
            }
          />
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Operations notes</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>
            Enroll students via the database or upcoming enrollment admin tools
            after courses are published.
          </li>
          <li>
            Link teachers to courses from the{" "}
            <Link href="/admin/staffing" className="font-medium text-indigo-600 hover:underline">
              staffing panel
            </Link>{" "}
            so grading queues populate correctly.
          </li>
          <li>
            Stripe billing integration remains deferred to the finale phase per
            the engineering roadmap.
          </li>
        </ul>
      </section>
    </DashboardShell>
  );
}
