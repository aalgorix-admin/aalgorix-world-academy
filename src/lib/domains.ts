import {
  isAuthPath,
  isDashboardPath,
} from "@/lib/auth/redirects";

/** Public marketing routes (served on the marketing origin in dual-domain mode). */
const MARKETING_PREFIXES = ["/courses", "/contact", "/faq"] as const;

function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Canonical marketing site origin (www.aalgorixacademy.com in production).
 */
export function getMarketingOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_MARKETING_URL?.trim();
  if (fromEnv) {
    return stripTrailingSlash(fromEnv);
  }
  return "http://localhost:3000";
}

/**
 * Authenticated app origin (www.awa.aalgorixacademy.com in production).
 * Falls back to marketing origin when unset (local monolith dev).
 */
export function getAppOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) {
    return stripTrailingSlash(fromEnv);
  }
  return getMarketingOrigin();
}

/** True when marketing and app origins differ (production dual-domain). */
export function isDualDomainMode(): boolean {
  return getMarketingOrigin() !== getAppOrigin();
}

export function normalizeHost(hostHeader: string): string {
  const host = hostHeader.split(",")[0]?.trim().toLowerCase() ?? "";
  const portIndex = host.lastIndexOf(":");
  if (portIndex > -1 && !host.includes("]")) {
    return host.slice(0, portIndex);
  }
  return host;
}

function hostFromOrigin(origin: string): string {
  return normalizeHost(new URL(origin).host);
}

export function getRequestHost(request: { headers: Headers }): string {
  return (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    ""
  );
}

export function isMarketingHost(hostHeader: string): boolean {
  if (!isDualDomainMode()) {
    return true;
  }
  return normalizeHost(hostHeader) === hostFromOrigin(getMarketingOrigin());
}

export function isAppHost(hostHeader: string): boolean {
  if (!isDualDomainMode()) {
    return true;
  }
  return normalizeHost(hostHeader) === hostFromOrigin(getAppOrigin());
}

export function isMarketingPath(pathname: string): boolean {
  if (pathname === "/") {
    return false;
  }
  return MARKETING_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isAppPath(pathname: string): boolean {
  return isAuthPath(pathname) || isDashboardPath(pathname);
}

export function marketingUrl(path = ""): string {
  const origin = getMarketingOrigin();
  if (!path) {
    return origin;
  }
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function appUrl(path = ""): string {
  const origin = getAppOrigin();
  if (!path) {
    return origin;
  }
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Shared parent domain for Supabase auth cookies (e.g. `.aalgorixacademy.com`).
 * Set AUTH_COOKIE_DOMAIN in production so sessions work across subdomains.
 */
export function getAuthCookieDomain(): string | undefined {
  const domain = process.env.AUTH_COOKIE_DOMAIN?.trim();
  return domain || undefined;
}

export function withAuthCookieDomain<T extends { domain?: string }>(
  options: T,
): T {
  const domain = getAuthCookieDomain();
  if (!domain) {
    return options;
  }
  return { ...options, domain };
}
