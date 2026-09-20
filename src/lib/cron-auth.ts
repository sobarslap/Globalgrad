import { timingSafeEqual } from "node:crypto";

/**
 * Authorize a Vercel Cron / manual invocation against CRON_SECRET.
 *
 * The comparison is constant-time (CWE-208): a plain `header !== \`Bearer …\``
 * short-circuits on the first differing byte, which leaks — over enough
 * samples — how much of the secret a guess got right. `timingSafeEqual` always
 * compares the full length. Fails closed: when no secret is configured the
 * endpoint is disabled.
 */
export type CronAuth =
  | { ok: true }
  | { ok: false; status: 401 | 503; error: string };

export function authorizeCron(req: Request): CronAuth {
  const secret = process.env.CRON_SECRET;
  if (!secret) return { ok: false, status: 503, error: "Not configured" };

  const provided = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // Equal-length guard first — timingSafeEqual throws on length mismatch, and
  // an unequal length already means the token is wrong.
  const ok = a.length === b.length && timingSafeEqual(a, b);
  if (!ok) return { ok: false, status: 401, error: "Unauthorized" };

  return { ok: true };
}
