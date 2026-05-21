import { SignOutButton } from "@/components/auth/sign-out-button";
import { createClient } from "@/lib/supabase/server";

export default async function StudentHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user!.id)
    .single();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
        Student area
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Phase 1 complete — your session is active. The full student dashboard
        arrives in Phase 4.
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Signed in as {profile?.email} ({profile?.role})
      </p>
      <SignOutButton />
    </main>
  );
}
