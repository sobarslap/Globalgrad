"use client";

import { motion } from "framer-motion";
import { Bot, GraduationCap, Coins, Plane, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";

const chips = [
  { icon: GraduationCap, label: "Match", angle: -90, color: "text-violet-400" },
  { icon: Coins, label: "Funding", angle: -18, color: "text-amber-400" },
  { icon: FileCheck, label: "Documents", angle: 54, color: "text-sky-400" },
  { icon: Plane, label: "Visa", angle: 126, color: "text-emerald-400" },
  { icon: Bot, label: "Advisor", angle: 198, color: "text-rose-400" },
];

function AdvisorOrb() {
  const radius = 120;
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* glow */}
      <div className="absolute h-64 w-64 rounded-full bg-primary/30 blur-3xl" />

      {/* rotating ring of chips */}
      <motion.div
        className="relative h-[300px] w-[300px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {chips.map(({ icon: Icon, label, angle, color }) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          return (
            <motion.div
              key={label}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              style={{ x, y }}
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur">
                <Icon className={`h-5 w-5 ${color}`} />
              </span>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                {label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* center node */}
      <motion.div
        className="absolute flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/40"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Bot className="h-9 w-9" />
      </motion.div>
    </div>
  );
}

export function Interactive3D() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Card className="relative h-[500px] w-full overflow-hidden border-white/10 bg-black/[0.96]">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
        <div className="flex h-full flex-col md:flex-row">
          <div className="relative z-10 flex flex-1 flex-col justify-center p-8">
            <h2 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Your admissions co-pilot
            </h2>
            <p className="mt-4 max-w-lg text-neutral-300">
              Meet the AI advisor that never guesses. It reasons over your
              profile and verified platform data to explain matches, compare
              countries and map your next steps — grounded, cited and honest
              about trade-offs.
            </p>
          </div>
          <div className="relative flex-1">
            <AdvisorOrb />
          </div>
        </div>
      </Card>
    </section>
  );
}
