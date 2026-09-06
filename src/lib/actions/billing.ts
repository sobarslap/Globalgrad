"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { baseUrl } from "@/lib/base-url";
import {
  getStripe,
  isStripeConfigured,
  priceIdFor,
  type Interval,
  type PlanKey,
} from "@/lib/stripe";

const PLAN_KEYS: PlanKey[] = ["pro", "institution"];

/**
 * Ensure the user has a Stripe customer, returning its id. Created lazily on the
 * first checkout and cached on the User row so we reuse it for future purchases
 * and the billing portal.
 */
async function ensureCustomer(userId: string, email?: string | null): Promise<string> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, email: true, name: true },
  });
  if (user?.stripeCustomerId) return user.stripeCustomerId;

  const customer = await getStripe().customers.create({
    email: email ?? user?.email ?? undefined,
    name: user?.name ?? undefined,
    metadata: { userId },
  });
  await db.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });
  return customer.id;
}

/**
 * Server action for a pricing CTA. Reads `plan` and `interval` from the form.
 * Logged-out users are sent to sign-in first; if billing isn't configured we
 * fall back to sign-up so the button is never dead. Otherwise we create a Stripe
 * Checkout Session and redirect the browser to Stripe's hosted page.
 */
export async function startCheckout(formData: FormData): Promise<void> {
  const plan = String(formData.get("plan") ?? "") as PlanKey;
  const interval = (String(formData.get("interval") ?? "month") as Interval) === "year"
    ? "year"
    : "month";

  if (!PLAN_KEYS.includes(plan)) redirect("/#pricing");

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent("/settings?checkout=" + plan)}`);
  }

  if (!isStripeConfigured) redirect("/sign-up");

  const priceId = priceIdFor(plan, interval);
  if (!priceId) redirect("/settings?billing=unconfigured");

  const origin = await baseUrl();
  const customerId = await ensureCustomer(session.user.id, session.user.email);

  const checkout = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: session.user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    success_url: `${origin}/settings?checkout=success`,
    cancel_url: `${origin}/#pricing`,
    subscription_data: { metadata: { userId: session.user.id } },
    metadata: { userId: session.user.id, plan },
  });

  if (!checkout.url) throw new Error("Stripe did not return a checkout URL.");
  redirect(checkout.url);
}

/**
 * Open the Stripe Billing Portal so the user can change plan, update the card,
 * or cancel — Stripe hosts the whole flow; changes flow back via the webhook.
 */
export async function openBillingPortal(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  if (!isStripeConfigured) redirect("/settings");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });
  if (!user?.stripeCustomerId) redirect("/settings?billing=none");

  const origin = await baseUrl();
  const portal = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${origin}/settings`,
  });
  redirect(portal.url);
}
