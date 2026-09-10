import {
  Gauge,
  Target,
  Coins,
  Globe2,
  ClipboardList,
  BellRing,
  Sparkles,
  Wallet,
  Plane,
} from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/marketing/kit";

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
  { icon: Wallet, label: "Funding Gap Analyzer", href: "/cost" },
  { icon: Plane, label: "Visa Preparation Hub", href: "/visa" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative border-y border-border/40 bg-card/20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="One platform, every decision"
          title="From a raw profile to an admit-ready strategy"
          lede="Rule-based engines do the heavy lifting. AI explains the results. You make confident, informed choices."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {flagship.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-border/60 bg-background/60 p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary ring-1 ring-inset ring-primary/20">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold">{title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {secondary.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-4 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
