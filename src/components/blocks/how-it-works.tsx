const steps = [
  {
    n: "01",
    title: "Build your profile",
    body: "Add academics, test scores, research, budget and goals. It takes minutes and powers everything else.",
  },
  {
    n: "02",
    title: "Get scored & matched",
    body: "See your readiness per tier, universities sorted into Safe / Target / Reach, and scholarship match percentages.",
  },
  {
    n: "03",
    title: "Plan the application",
    body: "A balanced shortlist, per-university document checklists, deadline alerts and a funding-gap plan.",
  },
  {
    n: "04",
    title: "Decide with confidence",
    body: "Country insights, real applicant comparisons and an AI advisor that explains every recommendation.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative border-y border-border/40 bg-card/30 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            How it works
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Four steps from unsure to unstoppable
          </h2>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="text-5xl font-bold text-primary/20">{s.n}</div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
