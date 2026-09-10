import { Check } from "lucide-react";
import { startCheckout, openBillingPortal } from "@/lib/actions/billing";
import type { UserBilling } from "@/lib/data/billing";

const PLAN_LABEL: Record<string, string> = {
  FREE: "Free",
  PRO: "Pro",
  INSTITUTION: "Institution",
};

const proPerks = [
  "Unlimited AI advisor",
  "Scholarship eligibility engine",
  "Funding gap analyzer",
];

/**
 * Billing card for /settings. Reads the effective plan from the mirrored
 * Subscription row and renders the right controls: upgrade (Stripe Checkout) for
 * Free users, or Manage billing (Stripe Billing Portal) for paid users. Both are
 * server-action forms — no client JS. Gracefully degrades when Stripe is unset.
 */
export function BillingSettings({
  billing,
  configured,
  justSubscribed,
}: {
  billing: UserBilling;
  configured: boolean;
  justSubscribed?: boolean;
}) {
  const isPaid = billing.plan !== "FREE";
  const renews = billing.currentPeriodEnd
    ? billing.currentPeriodEnd.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <section className="rounded-2xl border border-border/60 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Billing &amp; plan</h2>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isPaid
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {PLAN_LABEL[billing.plan] ?? billing.plan} plan
        </span>
      </div>

      {justSubscribed && (
        <p
          role="status"
          className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-500"
        >
          You&apos;re subscribed — thanks! Your plan is active.
        </p>
      )}

      {!configured ? (
        <p className="text-sm text-muted-foreground">
          Billing isn&apos;t configured in this environment yet. Once Stripe keys
          are set, you&apos;ll be able to upgrade and manage your plan here.
        </p>
      ) : isPaid ? (
        <div className="space-y-4 text-sm">
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="capitalize">{billing.status?.replace(/_/g, " ")}</dd>
            </div>
            {billing.interval && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Billing</dt>
                <dd className="capitalize">{billing.interval}ly</dd>
              </div>
            )}
            {renews && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  {billing.cancelAtPeriodEnd ? "Ends on" : "Renews on"}
                </dt>
                <dd>{renews}</dd>
              </div>
            )}
          </dl>
          {billing.cancelAtPeriodEnd && (
            <p className="text-xs text-muted-foreground">
              Your subscription is set to cancel at the end of the current period.
            </p>
          )}
          <form action={openBillingPortal}>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Manage billing
            </button>
          </form>
          <p className="text-xs text-muted-foreground">
            Change plan, update your card, or cancel in the secure Stripe portal.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You&apos;re on the Free plan. Upgrade to Pro to unlock the full engine:
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {proPerks.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                {p}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-1">
            <form action={startCheckout}>
              <input type="hidden" name="plan" value="pro" />
              <input type="hidden" name="interval" value="year" />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Upgrade to Pro — yearly
              </button>
            </form>
            <form action={startCheckout}>
              <input type="hidden" name="plan" value="pro" />
              <input type="hidden" name="interval" value="month" />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Pro — monthly
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
