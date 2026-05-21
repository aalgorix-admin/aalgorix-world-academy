"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="mt-8 text-sm font-medium text-indigo-600 transition hover:text-indigo-500 disabled:opacity-60 dark:text-indigo-400"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
