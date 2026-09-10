import "server-only";
import { db } from "@/lib/db";
import { isActiveStatus } from "@/lib/stripe";
import type { PlanTier } from "@prisma/client";

export type UserBilling = {
  plan: PlanTier; // effective plan (FREE unless an active paid subscription exists)
  status: string | null;
  interval: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  hasSubscriptionRecord: boolean;
};

/**
 * The signed-in user's effective billing state, read from the mirrored
 * Subscription row the webhook maintains. An inactive/canceled subscription
 * resolves to FREE so downstream gating is simply `plan === "PRO"`.
 */
export async function getUserBilling(userId: string): Promise<UserBilling> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  if (!sub) {
    return {
      plan: "FREE",
      status: null,
      interval: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      hasSubscriptionRecord: false,
    };
  }
  const active = isActiveStatus(sub.status);
  return {
    plan: active ? sub.plan : "FREE",
    status: sub.status,
    interval: sub.interval,
    currentPeriodEnd: sub.currentPeriodEnd,
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    hasSubscriptionRecord: true,
  };
}

/** Convenience: the effective plan tier only. */
export async function getUserPlan(userId: string): Promise<PlanTier> {
  return (await getUserBilling(userId)).plan;
}
