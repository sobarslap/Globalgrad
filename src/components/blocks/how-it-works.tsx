import { cn } from "@/lib/utils";
import { SectionHeading, TIERS } from "@/components/marketing/kit";

const steps = [
  {
    n: "01",
    title: "Build your profile",
    body: "Add academics, test scores, research, budget and goals. It takes minutes and powers everything else.",
    accent: "bg-emerald-500",
  },
  {
    n: "02",
    title: "Get scored & matched",
    body: "See your readiness per tier, universities sorted into Safe / Target / Reach, and scholarship match percentages.",
    accent: "bg-primary",
  },
  {
    n: "03",
    title: "Plan the application",
    body: "A balanced shortlist, per-university document checklists, deadline alerts and a funding-gap plan.",
    accent: "bg-amber-500",
  },
  {
    n: "04",
    title: "Decide with confidence",
    body: "Country insights, real applicant comparisons and an AI advisor that explains every recommendation.",
    accent: "bg-accent",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="How it works"
          title="Four steps from unsure to unstoppable"
        />

        <div className="relative mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* connector line across the row on large screens */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-emerald-500/40 via-primary/40 to-amber-500/40 lg:block"
          />
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="flex items-center gap-3 lg:block">
                <span
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-lg",
                    s.accent
                  )}
                >
                  {s.n}
                </span>
                <h3 className="text-lg font-semibold lg:mt-5">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* tier legend ties the palette back to the product output */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span>Your shortlist, colour-coded end to end:</span>
          {TIERS.map((t) => (
            <span key={t.key} className="inline-flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", t.dot)} />
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
