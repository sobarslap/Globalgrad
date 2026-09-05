import * as Sentry from "@sentry/nextjs";

/**
 * Next.js instrumentation hook (B4). `register` runs once per server instance
 * and loads the runtime-appropriate Sentry init; `onRequestError` forwards
 * server-side errors (Server Components, Route Handlers, Server Actions) to
 * Sentry. Both no-op when NEXT_PUBLIC_SENTRY_DSN is unset.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
