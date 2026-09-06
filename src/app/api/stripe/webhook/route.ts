import type Stripe from "stripe";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { getStripe, isStripeConfigured, planTierForPrice } from "@/lib/stripe";

// Stripe's SDK needs Node APIs (crypto for signature verification), not edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook — the ONLY writer of the Subscription mirror. Signature is
 * verified against the raw body; unverified or unconfigured requests are
 * rejected. Kept idempotent (upsert by stripeSubscriptionId) because Stripe may
 * redeliver events. This route lives under /api so the edge middleware skips it
 * (Stripe must reach it unauthenticated).
 */
export async function POST(req: Request): Promise<Response> {
  if (!isStripeConfigured || !env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Billing not configured", { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "invalid";
    return new Response(`Webhook signature verification failed: ${msg}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const sub = await getStripe().subscriptions.retrieve(
            session.subscription as string,
          );
          await upsertSubscription(sub, session.client_reference_id ?? undefined);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscription(sub);
        break;
      }
      default:
        // Ignore unrelated events (invoice.*, payment_intent.*, …).
        break;
    }
  } catch (err) {
    // Log server-side and return 500 so Stripe retries later.
    console.error("[stripe webhook] handler error", err);
    return new Response("Handler error", { status: 500 });
  }

  return new Response(null, { status: 200 });
}

/**
 * Map a Stripe Subscription onto our Subscription row. Resolves the owning user
 * from (in order) subscription metadata, the checkout's client_reference_id, or
 * the stored Stripe customer id.
 */
async function upsertSubscription(
  sub: Stripe.Subscription,
  clientReferenceId?: string,
): Promise<void> {
  const item = sub.items.data[0];
  const priceId = item?.price?.id ?? "";
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  // period end lives on the item in recent API versions; fall back to the sub.
  const periodEndUnix =
    item?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end;

  const userId =
    sub.metadata?.userId ||
    clientReferenceId ||
    (await db.user.findFirst({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    }))?.id;

  if (!userId) {
    console.warn("[stripe webhook] no user for subscription", sub.id);
    return;
  }

  const data = {
    userId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: sub.id,
    stripePriceId: priceId,
    plan: planTierForPrice(priceId),
    status: sub.status,
    interval: item?.price?.recurring?.interval ?? null,
    currentPeriodEnd: periodEndUnix ? new Date(periodEndUnix * 1000) : null,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
  };

  // Key on userId: we keep exactly one Subscription row per user, so a
  // resubscribe (new Stripe subscription id) replaces the prior canceled row
  // rather than colliding on the unique userId.
  await db.subscription.upsert({
    where: { userId },
    create: data,
    update: data,
  });
}
