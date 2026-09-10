"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { startCheckout } from "@/lib/actions/billing";
import type { PlanKey } from "@/lib/stripe";
import { Eyebrow } from "@/components/marketing/kit";

/**
 * PricingSection — rebuilt from Codehagen "Pricing" on 21st.dev: a monthly /
 * annual toggle over three tiers with a highlighted plan. Themeable.
 */
interface Tier {
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  features: string[];
  cta: string;
  href: string;
  /** When set, the CTA starts a Stripe Checkout for this plan; otherwise it's a link. */
  planKey?: PlanKey;
  highlighted?: boolean;
}

const tiers: Tier[] = [
  {
    name: "Free",
    description: "Everything you need to start planning.",
    monthly: 0,
    yearly: 0,
    features: [
      "Readiness score",
      "Safe / Target / Reach matching",
      "Country decision dashboard",
      "Basic deadline tracking",
    ],
    cta: "Get started",
    href: "/sign-up",
  },
  {
    name: "Pro",
    description: "For applicants who want the full engine.",
    monthly: 9,
    yearly: 84,
    features: [
      "Everything in Free",
      "Unlimited AI advisor",
      "Scholarship eligibility engine",
      "Funding gap analyzer",
    ],
    cta: "Start Pro",
    href: "/sign-up",
    planKey: "pro",
    highlighted: true,
  },
  {
    name: "Institution",
    description: "For agencies and university offices.",
    monthly: 49,
    yearly: 468,
    features: [
      "Everything in Pro",
      "Multi-student workspaces",
      "Bulk document tracking",
      "Priority support",
    ],
    cta: "Start Institution",
    href: "/sign-up",
    planKey: "institution",
  },
];

const btnClass = (highlighted?: boolean) =>
  cn(
    "mt-8 inline-flex h-11 w-full items-center justify-center rounded-full px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    highlighted
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "border border-border bg-background hover:bg-accent/10",
  );

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.05]">
            Start free. Upgrade when it pays off.
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            No credit card to begin. Cancel anytime.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border/60 bg-card/40 p-1 text-sm">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-4 py-1.5 transition-colors",
                !annual
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-full px-4 py-1.5 transition-colors",
                annual
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )}
            >
              Yearly
              <span className="ml-1.5 text-xs opacity-80">−22%</span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => {
            const price = annual ? tier.yearly : tier.monthly;
            const suffix =
              price === 0 ? "" : annual ? "/yr" : "/mo";
            return (
              <div
                key={tier.name}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-8 transition-colors",
                  tier.highlighted
                    ? "border-primary/60 bg-card/70 shadow-xl shadow-primary/10"
                    : "border-border/60 bg-card/40"
                )}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tier.description}
                </p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    ${price}
                  </span>
                  <span className="mb-1 text-sm text-muted-foreground">
                    {suffix}
                  </span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
                {tier.planKey ? (
                  <form action={startCheckout}>
                    <input type="hidden" name="plan" value={tier.planKey} />
                    <input
                      type="hidden"
                      name="interval"
                      value={annual ? "year" : "month"}
                    />
                    <button type="submit" className={btnClass(tier.highlighted)}>
                      {tier.cta}
                    </button>
                  </form>
                ) : (
                  <Link href={tier.href} className={btnClass(tier.highlighted)}>
                    {tier.cta}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
