import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";

import { ConnectChildPanel } from "./connect-child-panel";
import { LinkedLearnersPanel } from "./linked-learners-panel";

export default async function ParentSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/parent/settings");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "parent") {
    redirect("/parent");
  }

  const { data: relations } = await supabase
    .from("student_parent_relations")
    .select("student_id")
    .eq("parent_id", user.id);

  const studentIds = relations?.map((row) => row.student_id) ?? [];

  const { data: studentProfiles } =
    studentIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", studentIds)
      : { data: [] };

  const linkedChildren = studentProfiles ?? [];

  return (
    <DashboardShell
      eyebrow="Phase 6 · Family linking"
      title="Parent settings"
      subtitle={`Signed in as ${profile.full_name?.trim() || profile.email}`}
    >
      <Link
        href="/parent"
        className="mb-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        ← Back to parent dashboard
      </Link>

      <div className="space-y-6">
        <ConnectChildPanel />
        <LinkedLearnersPanel linkedChildren={linkedChildren} />
      </div>
    </DashboardShell>
  );
}
