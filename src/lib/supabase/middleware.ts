import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import {
  getDashboardPathForRole,
  isDashboardPath,
  isRecoveryPath,
  pathnameMatchesRole,
  shouldRedirectSignedInUserFromAuthPath,
} from "@/lib/auth/redirects";
import { isUserRole, type UserRole } from "@/lib/auth/roles";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const loginUrl = new URL("/login", request.url);

  if (!user && isDashboardPath(pathname)) {
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!user && isRecoveryPath(pathname)) {
    loginUrl.searchParams.set(
      "error",
      "Your reset link has expired. Please request a new one.",
    );
    return NextResponse.redirect(loginUrl);
  }

  if (!user) {
    return supabaseResponse;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role: UserRole | null =
    profile?.role && isUserRole(profile.role) ? profile.role : null;

  if (shouldRedirectSignedInUserFromAuthPath(pathname)) {
    const destination = role
      ? getDashboardPathForRole(role)
      : (request.nextUrl.searchParams.get("next") ?? "/");
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (role && isDashboardPath(pathname) && !pathnameMatchesRole(pathname, role)) {
    return NextResponse.redirect(
      new URL(getDashboardPathForRole(role), request.url),
    );
  }

  return supabaseResponse;
}
