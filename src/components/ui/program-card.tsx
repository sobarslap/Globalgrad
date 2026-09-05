import { cn } from "@/lib/utils";

/**
 * ProgramCard — rebuilt from kristen17 "Course Design Cards" on 21st.dev: a
 * rounded card with a tinted radial wash, a top meta row, a centered title and
 * subtitle, and a labelled progress bar. Used to summarise compared programs.
 * The accent follows the readiness bucket (Safe / Target / Reach).
 */
type Accent = "safe" | "target" | "reach" | "neutral";

const accents: Record<
  Accent,
  { wash: string; bar: string; text: string; label: string }
> = {
  safe: {
    wash: "from-emerald-500/25",
    bar: "bg-emerald-400",
    text: "text-emerald-400",
    label: "Safe",
  },
  target: {
    wash: "from-amber-500/25",
    bar: "bg-amber-400",
    text: "text-amber-400",
    label: "Target",
  },
  reach: {
    wash: "from-rose-500/25",
    bar: "bg-rose-400",
    text: "text-rose-400",
    label: "Reach",
  },
  neutral: {
    wash: "from-primary/20",
    bar: "bg-primary",
    text: "text-primary",
    label: "Selectivity",
  },
};

export interface ProgramCardProps {
  meta: string;
  title: string;
  subtitle: string;
  /** 0–100. */
  progress: number;
  accent?: Accent;
  /** Overrides the accent's default progress label. */
  progressLabel?: string;
}

export function ProgramCard({
  meta,
  title,
  subtitle,
  progress,
  accent = "neutral",
  progressLabel,
}: ProgramCardProps) {
  const a = accents[accent];
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  return (
    <div className="relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-80",
          a.wash
        )}
      />
      <div className="relative flex items-center justify-between text-xs text-muted-foreground">
        <span>{meta}</span>
        <span aria-hidden className="text-base leading-none">
          ⋮
        </span>
      </div>

      <div className="relative my-auto py-4 text-center">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{progressLabel ?? a.label}</span>
          <span className={cn("text-xs font-semibold uppercase", a.text)}>
            {accent === "neutral" ? `${pct}/100` : a.label}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className={cn("h-full rounded-full", a.bar)}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1 text-right text-xs text-muted-foreground">
          {pct}%
        </div>
      </div>
    </div>
  );
}
