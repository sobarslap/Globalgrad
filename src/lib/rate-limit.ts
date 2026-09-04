import { db } from "@/lib/db";

/**
 * Shared fixed-window rate limiter backed by Postgres, so limits actually hold
 * across serverless instances (an in-memory Map does not). A small race window
 * can allow marginal over-counting — acceptable for abuse prevention.
 */
export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
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
