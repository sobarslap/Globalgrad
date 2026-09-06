import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Database, Compass, MessageSquare } from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why GlobalGrad exists, how it turns your profile into grounded study-abroad recommendations, and how the data behind those recommendations is sourced.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    icon: Compass,
    title: "Decisions, explained",
    body: "Every score and recommendation shows the reasoning behind it. The goal is to help you decide, not to decide for you.",
  },
  {
    icon: Database,
    title: "Grounded in data",
    body: "Matching, cost, and eligibility come from structured data and transparent models — not vibes. Where a source is public, we cite it.",
  },
  {
    icon: ShieldCheck,
    title: "Honest by default",
    body: "No fake reviews, no invented visitor counts, no guaranteed-admission claims. Guidance is informational, never a substitute for official sources.",
  },
  {
    icon: MessageSquare,
    title: "You stay in control",
    body: "Your profile is yours. You can edit inputs, export your data, or delete your account and its data at any time.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Breadcrumbs items={[{ label: "About" }]} />

      <header className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Study-abroad decisions, grounded in data
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Choosing where to study abroad means juggling readiness, admission odds,
          scholarships, cost, funding, and visa rules — usually across a dozen
          browser tabs. GlobalGrad brings those decisions into one place and shows
          its work.
        </p>
      </header>

      <section className="mt-12 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">The story</h2>
        <p>
          GlobalGrad started from a simple frustration: the hardest part of studying
          abroad isn&apos;t filling in forms, it&apos;s making good decisions under
          uncertainty. Which universities are realistic? Which scholarships am I
          actually eligible for? Can I afford this once living costs and visa fees
          are counted? What does the visa process really involve?
        </p>
        <p>
          So each of those questions became a feature backed by an explicit model —
          a readiness scorecard, a Safe / Target / Reach matcher, a scholarship
          eligibility engine, a full cost-of-degree calculator with a funding-gap
          analyzer, and a visa preparation hub. An AI advisor sits on top, answering
          questions using the platform&apos;s own data rather than guessing.
        </p>
        <p>
          It was designed and built end-to-end by{" "}
          <span className="font-medium text-foreground">Zubairul Islam</span> as a
          portfolio project — a single, real, working product rather than a mockup.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-foreground">What we stand for</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="rounded-xl border border-border/60 bg-card/50 p-5">
              <p.icon className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="mt-3 font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-border/60 bg-card/50 p-6 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">A note on the data</h2>
        <p className="mt-3">
          GlobalGrad runs on a curated, realistic dataset — countries, universities,
          programs, scholarships, and anonymized past-applicant outcomes — chosen to
          demonstrate the full decision workflow. It is representative, not
          exhaustive, and it is not a live feed. Always confirm deadlines,
          requirements, and fees with the official source before you act on them.
        </p>
      </section>

      <section className="mt-12 flex flex-col items-start gap-4 rounded-xl border border-border/60 bg-gradient-to-br from-primary/10 to-transparent p-8">
        <h2 className="text-xl font-semibold text-foreground">Ready to see your matches?</h2>
        <p className="text-sm text-muted-foreground">
          Build a profile and get your readiness score, university buckets, and
          scholarship eligibility in a few minutes.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/sign-up">Create your profile</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/countries">Explore countries</Link>
          </Button>
        </div>
      </section>

      <p className="mt-10 text-sm text-muted-foreground">
        Questions or feedback? Email{" "}
        <a href={`mailto:${SITE.email}`} className="text-foreground underline underline-offset-4">
          {SITE.email}
        </a>
        .
      </p>
    </div>
  );
}
