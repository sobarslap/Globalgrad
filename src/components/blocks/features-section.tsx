"use client";

import {
  Gauge,
  Target,
  Coins,
  Globe2,
  ClipboardList,
  BellRing,
  Sparkles,
  Users,
  Wallet,
  Plane,
} from "lucide-react";
import Link from "next/link";
import { GradientCard } from "@/components/ui/gradient-card";

const flagship = [
  {
    icon: Gauge,
    title: "Candidate Readiness Score",
    description:
      "We analyze your GPA, IELTS, research and experience to score your readiness per university tier — surfacing your edge and flagging gaps before you apply.",
  },
  {
    icon: Target,
    title: "Smart University Matching",
    description:
      "Programs are auto-sorted into Safe, Target and Reach using your real profile — so every recommendation reflects your actual odds of admission.",
  },
  {
    icon: Coins,
    title: "Scholarship Eligibility Engine",
    description:
      "Your nationality, GPA and research are cross-referenced against real scholarship data to compute a funding match percentage — no irrelevant noise.",
  },
  {
    icon: Sparkles,
    title: "AI Study Abroad Advisor",
    description:
      "Ask anything. The advisor explains why a university fits, compares countries and summarizes public insight — always grounded in your data, never replacing the engine.",
  },
];

const secondary = [
  { icon: Globe2, label: "Country Decision Dashboard", href: "/countries" },
  { icon: ClipboardList, label: "Smart Document Checklist", href: "/applications" },
  { icon: BellRing, label: "Deadline & Requirement Monitor", href: "/calendar" },
  { icon: Users, label: "Similar Student Finder", href: "/similar" },
  { icon: Wallet, label: "Funding Gap Analyzer", href: "/cost" },
  { icon: Plane, label: "Visa Preparation Hub", href: "/visa" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            One platform, every decision
          </span>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            From a raw profile to an admit-ready strategy
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Rule-based engines do the heavy lifting. AI explains the results.
            You make confident, informed choices.
          </p>
        </div>

        <div className="mt-16 flex flex-wrap items-stretch justify-center gap-8">
          {flagship.map((f) => (
            <GradientCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              description={f.description}
            />
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {secondary.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-primary/40 hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
