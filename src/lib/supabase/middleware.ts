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
import {
  appUrl,
  getRequestHost,
  isAppHost,
  isDualDomainMode,
  withAuthCookieDomain,
} from "@/lib/domains";
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
          supabaseResponse.cookies.set(
            name,
            value,
            withAuthCookieDomain(options ?? {}),
          );
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const host = getRequestHost(request);
  const onAppOrigin = isDualDomainMode() && isAppHost(host);
  const loginUrl = new URL(
    "/login",
    onAppOrigin ? appUrl() : request.url,
  );

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
    if (onAppOrigin && pathname === "/") {
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role: UserRole | null =
    profile?.role && isUserRole(profile.role) ? profile.role : null;

  const redirectBase = onAppOrigin ? appUrl() : request.url;

  if (onAppOrigin && pathname === "/") {
    const destination = role ? getDashboardPathForRole(role) : "/login";
    return NextResponse.redirect(new URL(destination, redirectBase));
  }

  if (shouldRedirectSignedInUserFromAuthPath(pathname)) {
    const destination = role
      ? getDashboardPathForRole(role)
      : (request.nextUrl.searchParams.get("next") ?? "/");
    return NextResponse.redirect(new URL(destination, redirectBase));
  }

  if (role && isDashboardPath(pathname) && !pathnameMatchesRole(pathname, role)) {
    return NextResponse.redirect(
      new URL(getDashboardPathForRole(role), redirectBase),
    );
  }

  return supabaseResponse;
}
