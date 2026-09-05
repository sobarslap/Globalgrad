"use client";

import { motion } from "framer-motion";
import { Check, Gauge, Target, Coins } from "lucide-react";
import { ShinyButton } from "@/components/ui/shiny-button";

/**
 * CtaSection — rebuilt from designali "Book A Demo 1" on 21st.dev: a display
 * heading, a benefits checklist, a primary CTA, and a framed product mockup.
 * Replaces the old clipped lamp CTA. Themeable.
 */
const benefits = [
  "See your readiness score in minutes",
  "Programs auto-sorted into Safe / Target / Reach",
  "Scholarships matched to your real profile",
  "Deadline & document tracking that never sleeps",
  "An AI advisor grounded in verified data",
];

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.18),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Plan your study abroad{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              the right way
            </span>
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Free to start. Build your profile and see your first matches in
            minutes.
          </p>

          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <ShinyButton href="/sign-up">Create your profile</ShinyButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-3xl bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.25),transparent_70%)] blur-2xl" />
          <div className="relative rounded-2xl border border-border/60 bg-card/60 p-5 shadow-2xl backdrop-blur">
            <div className="mb-4 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <div className="space-y-3">
              {[
                { icon: Gauge, label: "Readiness score", value: "82 / 100", tint: "text-emerald-400" },
                { icon: Target, label: "Target universities", value: "14 matched", tint: "text-primary" },
                { icon: Coins, label: "Scholarships", value: "5 eligible", tint: "text-amber-400" },
              ].map(({ icon: Icon, label, value, tint }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-background/40 px-4 py-3"
                >
                  <span className="flex items-center gap-3 text-sm">
                    <Icon className={`h-4 w-4 ${tint}`} />
                    {label}
                  </span>
                  <span className="text-sm font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
