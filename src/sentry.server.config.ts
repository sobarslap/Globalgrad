import * as Sentry from "@sentry/nextjs";

// Server-side (Node runtime) Sentry init (B4). No-ops safely when the DSN is
// unset, and only enabled in production so local/dev noise never reaches Sentry.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled:
    !!process.env.NEXT_PUBLIC_SENTRY_DSN &&
    process.env.NODE_ENV === "production",
  // Sample 10% of transactions for performance monitoring — enough signal
  // without exhausting the free-tier quota.
  tracesSampleRate: 0.1,
});
