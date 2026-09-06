import "server-only";
import Stripe from "stripe";
import { env } from "@/lib/env";
import type { PlanTier } from "@prisma/client";

/**
 * Stripe server client (test mode). Billing is optional: if STRIPE_SECRET_KEY
 * is unset the app still runs and the pricing CTAs fall back to sign-up. Use
 * `getStripe()` on any billing path so a misconfigured env fails loudly there
 * rather than crashing unrelated pages at import time.
 */
export const isStripeConfigured = Boolean(env.STRIPE_SECRET_KEY);

let client: Stripe | null = null;
export function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured (STRIPE_SECRET_KEY missing).");
  }
  client ??= new Stripe(env.STRIPE_SECRET_KEY, {
    // Pin the API version for reproducible behavior across SDK upgrades.
    apiVersion: "2026-08-26.dahlia",
    typescript: true,
    appInfo: { name: "GlobalGrad" },
  });
  return client;
}

export type PlanKey = "pro" | "institution";
export type Interval = "month" | "year";

/** The four configured price IDs, keyed by plan + billing interval. */
const PRICE_IDS: Record<PlanKey, Record<Interval, string | undefined>> = {
  pro: {
    month: env.STRIPE_PRICE_PRO_MONTHLY,
    year: env.STRIPE_PRICE_PRO_YEARLY,
  },
  institution: {
    month: env.STRIPE_PRICE_INSTITUTION_MONTHLY,
    year: env.STRIPE_PRICE_INSTITUTION_YEARLY,
  },
};

export function priceIdFor(plan: PlanKey, interval: Interval): string | undefined {
  return PRICE_IDS[plan]?.[interval];
}

/** Reverse-map a Stripe price ID back to our PlanTier (for the webhook). */
export function planTierForPrice(priceId: string): PlanTier {
  if (
    priceId === env.STRIPE_PRICE_PRO_MONTHLY ||
    priceId === env.STRIPE_PRICE_PRO_YEARLY
  ) {
    return "PRO";
  }
  if (
    priceId === env.STRIPE_PRICE_INSTITUTION_MONTHLY ||
    priceId === env.STRIPE_PRICE_INSTITUTION_YEARLY
  ) {
    return "INSTITUTION";
  }
  return "FREE";
}

/** Stripe subscription statuses that grant paid access. */
export function isActiveStatus(status: string): boolean {
  return status === "active" || status === "trialing";
}
