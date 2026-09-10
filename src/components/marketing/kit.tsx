import { cn } from "@/lib/utils";

/**
 * Shared marketing design kit — the bespoke visual language every landing
 * section is built from, so the page reads as one system instead of a stack of
 * off-the-shelf blocks.
 *
 * The signature motif is GlobalGrad's core decision output: every university is
 * a Safe / Target / Reach tier, and those three colors (emerald / violet /
 * amber) recur as chips, dots, bars and gauges across the whole page.
 */

export const TIERS = [
  {
    key: "safe",
    label: "Safe",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
    ring: "ring-emerald-500/30",
    soft: "bg-emerald-500/10",
  },
  {
    key: "target",
    label: "Target",
    dot: "bg-primary",
    text: "text-primary",
    bar: "bg-primary",
    ring: "ring-primary/30",
    soft: "bg-primary/10",
  },
  {
    key: "reach",
    label: "Reach",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
    ring: "ring-amber-500/30",
    soft: "bg-amber-500/10",
  },
] as const;

/** Eyebrow / kicker label — small caps with a leading tier dot. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
        className
      )}
    >
      <span className="flex items-center gap-0.5" aria-hidden>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      </span>
      {children}
    </span>
  );
}

/** A word rendered with the signature primary→accent marker gradient. */
export function Marked({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
      {children}
    </span>
  );
}

/** Consistent section header: eyebrow + display heading + optional lede. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.05]">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 text-balance text-lg text-muted-foreground">{lede}</p>
      )}
    </div>
  );
}

/** Faint graph-paper texture — the signature backdrop, masked to fade out. */
export function GraphPaper({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]",
        className
      )}
    />
  );
}

/**
 * The product-true "Match report" card — GlobalGrad's signature artifact.
 * A readiness gauge over three tiered university rows and a scholarship match.
 * Pure markup so it can live inside animated (client) or static (server)
 * sections alike.
 */
export function MatchReport({ className }: { className?: string }) {
  const rows = [
    { tier: TIERS[0], name: "TU Munich — M.Sc. Informatics", pct: 88 },
    { tier: TIERS[0], name: "Uni of Melbourne — M.Sc. CS", pct: 81 },
    { tier: TIERS[1], name: "ETH Zürich — M.Sc. Data Science", pct: 63 },
    { tier: TIERS[1], name: "UBC — M.Sc. Computer Science", pct: 58 },
    { tier: TIERS[2], name: "MIT — M.Eng. EECS", pct: 29 },
  ];

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border/60 bg-card/70 p-4 shadow-2xl shadow-primary/10 backdrop-blur sm:p-5",
        className
      )}
    >
      {/* window chrome */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Match report · Example
        </span>
      </div>

      {/* readiness gauge + summary */}
      <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-background/50 p-4">
        <ReadinessGauge value={82} />
        <div className="min-w-0">
          <p className="text-sm font-semibold">Readiness 82 / 100</p>
          <p className="text-xs text-muted-foreground">
            Strong on research · IELTS band is your ceiling
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TIERS.map((t) => (
              <span
                key={t.key}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  t.soft,
                  t.text
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", t.dot)} />
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* tiered university rows */}
      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <div
            key={r.name}
            className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/40 px-3 py-2"
          >
            <span
              className={cn("h-2 w-2 shrink-0 rounded-full", r.tier.dot)}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-xs font-medium">
              {r.name}
            </span>
            <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block">
              <span
                className={cn("block h-full rounded-full", r.tier.bar)}
                style={{ width: `${r.pct}%` }}
              />
            </span>
            <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
              {r.pct}%
            </span>
          </div>
        ))}
      </div>

      {/* scholarship footer */}
      <div className="mt-3 flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2.5">
        <span className="text-xs font-medium">Scholarships you qualify for</span>
        <span className="text-xs font-semibold text-primary">5 matched · up to 90% funding</span>
      </div>
    </div>
  );
}

/** Small circular readiness gauge (SVG), stroked with the brand gradient. */
function ReadinessGauge({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0 -rotate-90">
      <defs>
        <linearGradient id="gg-gauge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth="6"
      />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="url(#gg-gauge)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
      <text
        x="32"
        y="32"
        textAnchor="middle"
        dominantBaseline="central"
        className="rotate-90 fill-foreground text-[15px] font-semibold"
        style={{ transformOrigin: "32px 32px" }}
      >
        {value}
      </text>
    </svg>
  );
}
