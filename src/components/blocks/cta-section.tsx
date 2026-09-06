"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Marked, MatchReport } from "@/components/marketing/kit";

/**
 * Closing CTA — a benefits checklist and dual call to action beside the same
 * signature Match report used in the hero, tying the page's open and close
 * together. Themeable.
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
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.05]">
            Plan your study abroad <Marked>the right way</Marked>
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

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <ShinyButton href="/sign-up">Create your profile</ShinyButton>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              or talk to the maker →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.25),transparent_70%)] blur-2xl" />
          <MatchReport className="relative" />
        </motion.div>
      </div>
    </section>
  );
}
