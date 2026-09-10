import * as Sentry from "@sentry/nextjs";

/**
 * Client-side Sentry init (B4). Runs in the browser; captures unhandled client
 * errors and App Router navigation spans. No-ops when the DSN is unset and only
 * enabled in production. Session Replay is left off to conserve the free tier.
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled:
    !!process.env.NEXT_PUBLIC_SENTRY_DSN &&
    process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
