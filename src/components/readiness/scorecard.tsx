import { Check, AlertTriangle, ArrowRight } from "lucide-react";
import type { TierReadiness } from "@/lib/engines/readiness";
import { Badge } from "@/components/ui/badge";

function scoreTone(score: number): "safe" | "target" | "reach" {
  if (score >= 80) return "safe";
  if (score >= 55) return "target";
  return "reach";
}

function TierColumn({ tier }: { tier: TierReadiness }) {
  const tone = scoreTone(tier.score);
  const ring =
    tone === "safe"
      ? "border-emerald-500/30"
      : tone === "target"
        ? "border-amber-500/30"
        : "border-rose-500/30";

  return (
    <div className={`flex flex-col rounded-2xl border ${ring} bg-card/50 p-6`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{tier.label}</h3>
        <Badge tone={tone}>{tier.programCount} programs</Badge>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl font-bold leading-none">{tier.score}</span>
        <span className="mb-1 text-sm text-muted-foreground">/ 100 readiness</span>
      </div>

      {tier.strengths.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
            Strengths
          </p>
          <ul className="mt-2 space-y-1.5">
            {tier.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tier.weaknesses.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
            Weaknesses
          </p>
          <ul className="mt-2 space-y-1.5">
            {tier.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tier.recommendations.length > 0 && (
        <div className="mt-5 border-t border-border/50 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Recommendations
          </p>
          <ul className="mt-2 space-y-1.5">
            {tier.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tier.programCount === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          No programs in this tier yet — try the university matcher.
        </p>
      )}
    </div>
  );
}

export function Scorecard({ tiers }: { tiers: TierReadiness[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {tiers.map((t) => (
        <TierColumn key={t.tier} tier={t} />
      ))}
    </div>
  );
}
