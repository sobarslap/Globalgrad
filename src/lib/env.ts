import { z } from "zod";

/**
 * Server-side environment validation. Importing this module throws at startup if a
 * critical variable is missing or malformed — the app refuses to run misconfigured
 * (Security check 3.1). Never import this from client components.
 */
const schema = z.object({
  DATABASE_URL: z.string().url().startsWith("postgres"),
  DIRECT_URL: z.string().url().startsWith("postgres").optional(),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be a long random string"),
  AUTH_URL: z.string().url().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  // Optional distributed rate limiting (B3). When both are set, hot paths use
  // Upstash Redis; otherwise the limiter falls back to Postgres.
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Log field names only — never the values — then fail fast.
  const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
  throw new Error(
    `Invalid or missing environment variables: ${missing}. See .env.example.`
  );
}

export const env = parsed.data;
