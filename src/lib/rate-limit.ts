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

  const existing = await db.rateLimit.findUnique({ where: { key } });

  // New window (or first hit): reset the counter.
  if (!existing || existing.resetAt <= now) {
    await db.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, resetAt },
      update: { count: 1, resetAt },
    });
    return { ok: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000),
    };
  }

  await db.rateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });
  return { ok: true, remaining: limit - existing.count - 1, retryAfterSec: 0 };
}

/** Best-effort client IP from proxy headers (Vercel/Neon-style). */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
