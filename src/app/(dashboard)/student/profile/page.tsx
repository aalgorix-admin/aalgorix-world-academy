import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { unwrapOne } from "@/lib/dashboard/relations";
import { getDashboardPathForRole } from "@/lib/auth/redirects";
import { isUserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

import { ProfileForm } from "./profile-form";
import { buildStudentProfileData, type LinkedParentGuardian } from "./types";

type ParentProfileRow = {
  id: string;
  full_name: string | null;
  email: string;
};

export default async function StudentProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/student/profile");
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("role, full_name, email, phone, date_of_birth, created_at, metadata")
    .eq("id", user.id)
    .single();

  if (profileRow?.role !== "student") {
    const destination =
      profileRow?.role && isUserRole(profileRow.role)
        ? getDashboardPathForRole(profileRow.role)
        : "/login";
    redirect(destination);
  }

  const profile = buildStudentProfileData({
    id: user.id,
    full_name: profileRow.full_name,
    email: profileRow.email,
    phone: profileRow.phone,
    date_of_birth: profileRow.date_of_birth,
    created_at: profileRow.created_at,
    metadata: profileRow.metadata,
  });

  const { data: relationRows } = await supabase
    .from("student_parent_relations")
    .select(
      `
      parent_id,
      parent:profiles!parent_id (
        id,
        full_name,
        email
      )
    `,
    )
    .eq("student_id", user.id);

  const linkedParents: LinkedParentGuardian[] =
    relationRows?.flatMap((row) => {
      const parent = unwrapOne(
        row.parent as ParentProfileRow | ParentProfileRow[] | null,
      );
      if (!parent) return [];
      return [
        {
          id: parent.id,
          full_name: parent.full_name,
          email: parent.email,
        },
      ];
    }) ?? [];

  return (
    <DashboardShell
      eyebrow="Student passport hub"
      title="Your Academic Passport"
      subtitle="Manage your learner identity, residential details, academic cohort records, and family guardian connections in one secure profile."
    >
      <Link
        href="/student"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-all duration-200 hover:text-indigo-800 active:scale-[0.98]"
      >
        <span aria-hidden>←</span>
        Back to learning dashboard
      </Link>

      <ProfileForm profile={profile} linkedParents={linkedParents} />
    </DashboardShell>
  );
}
