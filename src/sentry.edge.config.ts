import * as Sentry from "@sentry/nextjs";

// Edge runtime (middleware) Sentry init (B4). Same policy as the server config.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled:
    !!process.env.NEXT_PUBLIC_SENTRY_DSN &&
    process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
});
