import type { UserRole } from "@/lib/auth/roles";

const ROLE_HOME: Record<UserRole, string> = {
  student: "/student",
  parent: "/parent",
  teacher: "/teacher",
  admin: "/admin",
};

const ROLE_PREFIXES: Record<UserRole, string> = {
  student: "/student",
  parent: "/parent",
  teacher: "/teacher",
  admin: "/admin",
};

export function getDashboardPathForRole(role: UserRole): string {
  return ROLE_HOME[role];
}

export function getRolePrefixForRole(role: UserRole): string {
  return ROLE_PREFIXES[role];
}

export function pathnameMatchesRole(pathname: string, role: UserRole): boolean {
  const prefix = ROLE_PREFIXES[role];
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isDashboardPath(pathname: string): boolean {
  return (
    pathname.startsWith("/student") ||
    pathname.startsWith("/parent") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/admin")
  );
}

export const AUTH_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
] as const;

/** Paths that must stay reachable while authenticated (e.g. password recovery). */
export const AUTH_PATHS_ALLOW_WHEN_SIGNED_IN = ["/reset-password"] as const;

export function isAuthPath(pathname: string): boolean {
  return (
    AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname.startsWith("/auth/")
  );
}

export function isRecoveryPath(pathname: string): boolean {
  return (
    pathname === "/reset-password" || pathname.startsWith("/reset-password/")
  );
}

export function shouldRedirectSignedInUserFromAuthPath(pathname: string): boolean {
  return isAuthPath(pathname) && !isRecoveryPath(pathname);
}

/**
 * Validates an internal post-auth redirect path from query params.
 * Rejects open redirects and external URLs.
 */
export function safeRedirectPath(next: string | null): string | null {
  if (!next || next === "/") {
    return null;
  }
  if (!next.startsWith("/") || next.startsWith("//")) {
    return null;
  }
  return next;
}
