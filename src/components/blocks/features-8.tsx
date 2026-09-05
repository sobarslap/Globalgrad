"use client";

import { motion } from "framer-motion";
import { Bot, Globe2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Features8 — rebuilt from Tailark "Features 8" (Méschac Irung) on 21st.dev:
 * a heading over a bento grid of feature cards, each carrying a small animated
 * illustration. Replaces the old orbiting "co-pilot" section. Themeable.
 */

function CardShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/40",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Animated concentric orb — the AI advisor. */
function AdvisorArt() {
  return (
    <div className="relative flex h-40 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border border-primary/30"
          style={{ width: 60 + i * 48, height: 60 + i * 48 }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.25, 0.6] }}
          transition={{
            duration: 3,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.span
        className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/40"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Bot className="h-8 w-8" />
      </motion.span>
    </div>
  );
}

/** Dotted globe with pulsing location pins. */
function GlobeArt() {
  const pins = [
    { top: "28%", left: "22%" },
    { top: "40%", left: "62%" },
    { top: "62%", left: "40%" },
    { top: "34%", left: "80%" },
  ];
  return (
    <div className="relative h-40">
      <div
        className="absolute inset-0 opacity-40 [background-image:radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
      />
      {pins.map((p, i) => (
        <span
          key={i}
          className="absolute h-2.5 w-2.5 rounded-full bg-primary"
          style={{ top: p.top, left: p.left }}
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-primary"
            animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </span>
      ))}
    </div>
  );
}

/** Rising bars — verified, grounded data. */
function DataArt() {
  const bars = [40, 68, 52, 84, 60, 92];
  return (
    <div className="flex h-40 items-end justify-center gap-2 px-2">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-5 rounded-t bg-gradient-to-t from-primary/40 to-primary"
          initial={{ height: 8 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function Features8() {
  return (
    <section className="relative py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Your admissions co-pilot
          </span>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            An advisor that reasons, never guesses
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            It works over your real profile and verified platform data —
            explaining matches, comparing countries and mapping next steps,
            grounded and cited.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          <CardShell className="md:row-span-1">
            <AdvisorArt />
            <div className="mt-4 flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">AI study-abroad advisor</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask anything. Every answer is tied to your data and the engine —
              honest about trade-offs.
            </p>
          </CardShell>

          <CardShell>
            <GlobeArt />
            <div className="mt-4 flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Compare countries</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Weigh cost, visa odds and outcomes across destinations side by
              side.
            </p>
          </CardShell>

          <CardShell>
            <DataArt />
            <div className="mt-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Grounded in real data</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Recommendations reflect verified programs, scholarships and public
              insight — not vibes.
            </p>
          </CardShell>
        </div>
      </div>
    </section>
  );
}
