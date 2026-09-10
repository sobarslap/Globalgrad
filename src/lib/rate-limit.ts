import { Redis } from "@upstash/redis";
import { db } from "@/lib/db";

/**
 * Shared fixed-window rate limiter (B3). When Upstash Redis is configured it
 * runs there — a single atomic INCR per hit, which holds across serverless
 * instances without a DB write. Otherwise (or if Redis errors) it falls back to
 * the Postgres limiter below, so local/dev and outages still enforce limits.
 * A small race window can allow marginal over-counting — fine for abuse control.
 */
export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

let redis: Redis | null | undefined; // undefined = not yet resolved
function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

/**
 * Upstash path. Returns a result, or null to signal "not configured / errored —
 * use the fallback". Fixed window: the first hit in a window sets the TTL; the
 * key self-heals if it ever loses its expiry.
 */
async function rateLimitRedis(
  r: Redis,
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult | null> {
  const k = `rl:${key}`;
  try {
    const count = await r.incr(k);
    if (count === 1) {
      await r.pexpire(k, windowMs);
      return { ok: true, remaining: limit - 1, retryAfterSec: 0 };
    }
    if (count > limit) {
      let ttl = await r.pttl(k);
      if (ttl < 0) {
        // Missing expiry (edge case): re-arm it so the key can't block forever.
        await r.pexpire(k, windowMs);
        ttl = windowMs;
      }
      return { ok: false, remaining: 0, retryAfterSec: Math.ceil(ttl / 1000) };
    }
    return { ok: true, remaining: Math.max(0, limit - count), retryAfterSec: 0 };
  } catch (err) {
    console.error("[rate-limit] Upstash error, falling back to Postgres:", err);
    return null;
  }
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const r = getRedis();
  if (r) {
    const res = await rateLimitRedis(r, key, limit, windowMs);
    if (res) return res;
  }

  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  // Atomic check-and-increment in a single statement so concurrent hits can't
  // both read a stale count and over-increment past the limit. On a fresh window
  // (expired resetAt) the counter resets to 1; otherwise it increments.
  const rows = await db.$queryRaw<{ count: number; resetAt: Date }[]>`
    INSERT INTO "RateLimit" ("key", "count", "resetAt")
    VALUES (${key}, 1, ${resetAt})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimit"."resetAt" <= ${now} THEN 1 ELSE "RateLimit"."count" + 1 END,
      "resetAt" = CASE WHEN "RateLimit"."resetAt" <= ${now} THEN ${resetAt} ELSE "RateLimit"."resetAt" END
    RETURNING "count", "resetAt"`;

  const row = rows[0];
  const count = Number(row.count);
  const windowResetAt = new Date(row.resetAt);
  if (count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.ceil((windowResetAt.getTime() - now.getTime()) / 1000),
    };
  }
  return { ok: true, remaining: Math.max(0, limit - count), retryAfterSec: 0 };
}

/** Best-effort client IP from proxy headers (Vercel/Neon-style). */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
