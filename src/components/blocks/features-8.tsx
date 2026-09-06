"use client";

import { motion } from "framer-motion";
import { Gauge, Target, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading, TIERS } from "@/components/marketing/kit";

/**
 * "The engine" — the signature section that shows GlobalGrad's three core
 * engines working on a profile, each with a bespoke, product-true mini
 * visualization built from the shared tier color system.
 */

function Card({
  icon: Icon,
  title,
  body,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/40",
        className
      )}
    >
      <div className="mb-5 flex-1">{children}</div>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </motion.div>
  );
}

/** Radial readiness gauge that fills on scroll. */
function GaugeViz() {
  const value = 82;
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex h-40 items-center justify-center">
      <div className="relative">
        <svg viewBox="0 0 128 128" className="h-36 w-36 -rotate-90">
          <defs>
            <linearGradient id="eng-gauge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
          <circle cx="64" cy="64" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
          <motion.circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke="url(#eng-gauge)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tracking-tight">{value}</span>
          <span className="text-[11px] text-muted-foreground">/ 100</span>
        </div>
      </div>
    </div>
  );
}

/** Three tier buckets with animated fill — the Safe/Target/Reach matcher. */
function MatcherViz() {
  const counts = [6, 8, 3];
  return (
    <div className="flex h-40 items-end justify-center gap-4">
      {TIERS.map((t, i) => (
        <div key={t.key} className="flex w-16 flex-col items-center gap-2">
          <motion.div
            className={cn("w-full rounded-t-lg", t.bar)}
            initial={{ height: 6 }}
            whileInView={{ height: 30 + counts[i] * 11 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: "easeOut" }}
          />
          <span className="text-xs font-semibold">{counts[i]}</span>
          <span className={cn("text-[11px] font-medium", t.text)}>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Ranked scholarship match bars. */
function ScholarshipViz() {
  const rows = [
    { name: "DAAD EPOS", pct: 90 },
    { name: "Chevening", pct: 74 },
    { name: "Erasmus Mundus", pct: 61 },
  ];
  return (
    <div className="flex h-40 flex-col justify-center gap-3">
      {rows.map((s, i) => (
        <div key={s.name} className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="font-medium">{s.name}</span>
            <span className="text-muted-foreground">{s.pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              whileInView={{ width: `${s.pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Features8() {
  return (
    <section className="relative py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="The decision engine"
          title="Three engines turn your profile into a plan"
          lede="Rule-based models do the reasoning; every number is explainable. This is what runs the moment you finish your profile."
        />

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          <Card
            icon={Gauge}
            title="Readiness score"
            body="Your GPA, tests, research and experience become one score per university tier — with the gaps holding you back flagged."
          >
            <GaugeViz />
          </Card>
          <Card
            icon={Target}
            title="Safe / Target / Reach"
            body="Every program is bucketed by your real odds, so the shortlist is balanced instead of wishful."
          >
            <MatcherViz />
          </Card>
          <Card
            icon={Coins}
            title="Scholarship match"
            body="Your profile is scored against each award's criteria — only the funding you're actually competitive for surfaces."
          >
            <ScholarshipViz />
          </Card>
        </div>
      </div>
    </section>
  );
}
