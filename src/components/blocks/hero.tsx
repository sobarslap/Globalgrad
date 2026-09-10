"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Eyebrow, Marked, GraphPaper, MatchReport } from "@/components/marketing/kit";

interface HeroProps {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaText: string;
}

const trust = [
  { k: "4", v: "decision engines" },
  { k: "15", v: "planning tools" },
  { k: "0", v: "guesswork" },
];

export function Hero({ eyebrow, title, highlight, subtitle, ctaText }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* signature backdrop: graph paper + tri-tier glows */}
      <GraphPaper />
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.05fr_1fr]">
        {/* copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
            {title} <Marked>{highlight}</Marked>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background/50 px-7 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Talk to the maker
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-6">
            {trust.map((t) => (
              <div key={t.v}>
                <div className="text-2xl font-semibold tracking-tight">{t.k}</div>
                <div className="text-xs text-muted-foreground">{t.v}</div>
              </div>
            ))}
            <div className="hidden items-center gap-2 border-l border-border/60 pl-6 text-xs text-muted-foreground sm:flex">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Grounded in real data, not vibes
            </div>
          </div>
        </motion.div>

        {/* product-true match report */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.25),transparent_70%)] blur-2xl" />
          <MatchReport className="relative" />
        </motion.div>
      </div>
    </section>
  );
}
