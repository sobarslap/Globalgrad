"use client";

import { useMemo, useState } from "react";
import {
  computeCost,
  analyzeFundingGap,
  type CostInputs,
} from "@/lib/engines/cost";
import type { CostProgram } from "@/lib/data/catalog";
import type { FxRates } from "@/lib/fx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  programs: CostProgram[];
  cheaperCountries: { name: string; monthlyLivingUsd: number }[];
  eligibleScholarships: { name: string; amountUsd?: number }[];
  fx: { rates: FxRates; live: boolean };
}

const defaults: CostInputs = {
  tuitionUsd: 30000,
  monthlyLivingUsd: 1200,
  months: 24,
  visaFeeUsd: 160,
  insuranceUsd: 800,
  applicationFeeUsd: 100,
  flightUsd: 900,
  emergencyUsd: 2000,
};

const field = (k: keyof CostInputs, label: string) => ({ k, label });
const fields = [
  field("tuitionUsd", "Total tuition"),
  field("monthlyLivingUsd", "Living / month"),
  field("months", "Duration (months)"),
  field("visaFeeUsd", "Visa fee"),
  field("insuranceUsd", "Insurance"),
  field("applicationFeeUsd", "Application fees"),
  field("flightUsd", "Flights"),
  field("emergencyUsd", "Emergency funds"),
];

export function CostCalculator({
  programs,
  cheaperCountries,
  eligibleScholarships,
  fx,
}: Props) {
  const [inputs, setInputs] = useState<CostInputs>(defaults);
  const [budget, setBudget] = useState(20000);
  const [currency, setCurrency] = useState("USD");
  const [programId, setProgramId] = useState("");

  const rate = fx.rates[currency] ?? 1;
  const fmt = (usd: number) =>
    `${currency === "USD" ? "$" : ""}${Math.round(usd * rate).toLocaleString()}${
      currency === "USD" ? "" : " " + currency
    }`;

  const set = (k: keyof CostInputs, v: string) =>
    setInputs((p) => ({ ...p, [k]: Number(v) || 0 }));

  const onProgram = (id: string) => {
    setProgramId(id);
    const p = programs.find((x) => x.id === id);
    if (!p) return;
    const years = Math.max(1, Math.round(inputs.months / 12));
    setInputs((prev) => ({
      ...prev,
      tuitionUsd: p.tuitionUsd ? p.tuitionUsd * years : prev.tuitionUsd,
      monthlyLivingUsd: p.monthlyLivingUsd ?? prev.monthlyLivingUsd,
    }));
  };

  const breakdown = useMemo(() => computeCost(inputs), [inputs]);
  const gap = useMemo(
    () =>
      analyzeFundingGap(breakdown.total, budget, {
        scholarships: eligibleScholarships,
        cheaperCountries,
      }),
    [breakdown.total, budget, eligibleScholarships, cheaperCountries]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="space-y-5 rounded-2xl border border-border/60 p-5">
        <div className="space-y-1.5">
          <Label htmlFor="program">Prefill from a program (optional)</Label>
          <select
            id="program"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={programId}
            onChange={(e) => onProgram(e.target.value)}
          >
            <option value="">— choose —</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {fields.map(({ k, label }) => (
            <div key={k} className="space-y-1.5">
              <Label htmlFor={k}>{label}</Label>
              <Input
                id={k}
                type="number"
                value={inputs[k]}
                onChange={(e) => set(k, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="budget">Your budget (USD)</Label>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="currency">Show totals in</Label>
            <select
              id="currency"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {Object.keys(fx.rates).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Rates {fx.live ? "live" : "approximate (offline fallback)"}.
        </p>
      </div>

      {/* Results */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-border/60 p-5">
          <h2 className="mb-4 font-semibold">Estimated total cost</h2>
          <dl className="space-y-1.5 text-sm">
            {(
              [
                ["Tuition", breakdown.tuition],
                ["Living", breakdown.living],
                ["Visa", breakdown.visa],
                ["Insurance", breakdown.insurance],
                ["Application", breakdown.application],
                ["Flights", breakdown.flight],
                ["Emergency", breakdown.emergency],
              ] as const
            ).map(([label, v]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-muted-foreground">{label}</dt>
                <dd>{fmt(v)}</dd>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-border/60 pt-2 text-base font-bold">
              <dt>Total</dt>
              <dd>{fmt(breakdown.total)}</dd>
            </div>
          </dl>
        </div>

        {/* Funding gap */}
        <div className="rounded-2xl border border-border/60 p-5">
          <h2 className="mb-3 font-semibold">Funding gap</h2>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Budget covers {gap.coveredPct}%
            </span>
            <span
              className={
                gap.gap > 0
                  ? "font-semibold text-rose-500"
                  : "font-semibold text-emerald-500"
              }
            >
              {gap.gap > 0 ? `${fmt(gap.gap)} short` : "Fully funded"}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${gap.gap > 0 ? "bg-amber-500" : "bg-emerald-500"}`}
              style={{ width: `${gap.coveredPct}%` }}
            />
          </div>

          {gap.suggestions.length > 0 && (
            <ul className="mt-4 space-y-2">
              {gap.suggestions.map((s, i) => (
                <li key={i} className="text-sm">
                  <span className="font-medium">{s.label}.</span>{" "}
                  <span className="text-muted-foreground">{s.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
