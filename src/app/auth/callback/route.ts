import { NextResponse } from "next/server";

import {
  getDashboardPathForRole,
  safeRedirectPath,
} from "@/lib/auth/redirects";
import { isUserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  const safeNext = safeRedirectPath(nextParam);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (safeNext) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.role && isUserRole(profile.role)) {
          return NextResponse.redirect(
            `${origin}${getDashboardPathForRole(profile.role)}`,
          );
        }
      }

      return NextResponse.redirect(`${origin}/`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Could not complete sign-in. Please try again.")}`,
  );
}
