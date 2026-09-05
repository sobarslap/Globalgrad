import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const isDev = process.env.NODE_ENV === "development";

/**
 * Build the per-request Content Security Policy (B1). script-src uses a nonce +
 * strict-dynamic so no inline script runs without the matching nonce — closing
 * the XSS gap that `'unsafe-inline'` leaves open. style-src deliberately KEEPS
 * `'unsafe-inline'`: Framer Motion writes inline styles and a strict style
 * policy would break the site's animations (styles can't execute JS, so this is
 * a much smaller risk than scripts). 'unsafe-eval' is dev-only (React refresh).
 */
function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    `connect-src 'self' https://*.sentry.io${isDev ? " ws: http://localhost:*" : ""}`,
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ]
    .join("; ")
    .concat(isDev ? "" : "; upgrade-insecure-requests");
}

/**
 * Single edge middleware: (1) route protection for authed areas, (2) a fresh
 * per-request nonce + CSP on every HTML response. Protection is enforced here
 * (not only via the `authorized` callback) so it holds regardless of how the
 * functional `auth()` wrapper treats that callback.
 */
export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role;

  const denied =
    (pathname.startsWith("/admin") && role !== "ADMIN") ||
    (pathname.startsWith("/content") &&
      role !== "CONTENT_MANAGER" &&
      role !== "ADMIN") ||
    (pathname.startsWith("/dashboard") && !isLoggedIn);

  if (denied) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl.origin));
  }

  // Fresh nonce per request (Web Crypto — edge-safe, no Buffer).
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16)))
  );
  const csp = buildCsp(nonce);

  // Next reads the nonce from the request's CSP header and stamps it onto its
  // own framework/bundle scripts during SSR; x-nonce lets the root layout pass
  // it to next-themes' pre-hydration inline script.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("content-security-policy", csp);
  return res;
});

export const config = {
  // Run on all document routes; skip API, Next internals, favicon, and
  // link-prefetch requests (which don't render HTML and don't need a nonce).
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
