import { type NextRequest, NextResponse } from "next/server";

import {
  appUrl,
  getRequestHost,
  isAppHost,
  isAppPath,
  isDualDomainMode,
  isMarketingHost,
  isMarketingPath,
  marketingUrl,
} from "@/lib/domains";

/**
 * Redirects requests that hit the wrong production host for their route class.
 * Marketing pages → marketing origin; auth/dashboard → app origin.
 */
export function resolveCrossDomainRedirect(
  request: NextRequest,
): NextResponse | null {
  if (!isDualDomainMode()) {
    return null;
  }

  const host = getRequestHost(request);
  const { pathname, search } = request.nextUrl;

  if (isMarketingHost(host) && isAppPath(pathname)) {
    return NextResponse.redirect(new URL(`${pathname}${search}`, appUrl()));
  }

  if (isAppHost(host) && pathname !== "/" && isMarketingPath(pathname)) {
    return NextResponse.redirect(
      new URL(`${pathname}${search}`, marketingUrl()),
    );
  }

  return null;
}
