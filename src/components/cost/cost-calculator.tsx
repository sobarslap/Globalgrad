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
  const [compareIds, setCompareIds] = useState<string[]>([]);

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

  // Multi-program comparison: each program's full cost using its own real
  // tuition + its country's living cost, sharing the current fixed-cost inputs.
  const years = Math.max(1, Math.round(inputs.months / 12));
  const withTuition = useMemo(
    () => programs.filter((p) => p.tuitionUsd != null),
    [programs]
  );
  const programTotal = (p: CostProgram) =>
    computeCost({
      ...inputs,
      tuitionUsd: (p.tuitionUsd ?? 0) * years,
      monthlyLivingUsd: p.monthlyLivingUsd ?? inputs.monthlyLivingUsd,
    }).total;
  const toggleCompare = (id: string) =>
    setCompareIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  const compared = compareIds
    .map((id) => withTuition.find((p) => p.id === id))
    .filter((p): p is CostProgram => !!p)
    .map((p) => ({ p, total: programTotal(p) }))
    .sort((a, b) => a.total - b.total);

  return (
    <div className="space-y-8">
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

    {/* Multi-program comparison */}
    <div className="rounded-2xl border border-border/60 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold">Compare programs side by side</h2>
        <p className="text-xs text-muted-foreground">
          Uses each program&apos;s real tuition (×{years}yr) and its country&apos;s
          living cost, with your shared visa/insurance/flight assumptions.
        </p>
      </div>

      <div className="mt-4 max-h-40 overflow-y-auto rounded-lg border border-border/50 p-3">
        <div className="grid gap-1.5 sm:grid-cols-2">
          {withTuition.map((p) => (
            <label
              key={p.id}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--primary)]"
                checked={compareIds.includes(p.id)}
                onChange={() => toggleCompare(p.id)}
              />
              <span className="truncate">{p.label}</span>
            </label>
          ))}
        </div>
      </div>

      {compared.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Select two or more programs above to compare their full estimated cost.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Program</th>
                <th className="py-2 pr-3 font-medium">Country</th>
                <th className="py-2 pr-3 text-right font-medium">Tuition ({years}yr)</th>
                <th className="py-2 pr-3 text-right font-medium">Total cost</th>
                <th className="py-2 text-right font-medium">vs budget</th>
              </tr>
            </thead>
            <tbody>
              {compared.map(({ p, total }, idx) => {
                const withinBudget = total <= budget;
                return (
                  <tr key={p.id} className="border-b border-border/40">
                    <td className="py-2 pr-3">
                      <span className="font-medium">{p.label}</span>
                      {idx === 0 && (
                        <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-500">
                          cheapest
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">
                      {p.countryName ?? "—"}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {fmt((p.tuitionUsd ?? 0) * years)}
                    </td>
                    <td className="py-2 pr-3 text-right font-semibold">{fmt(total)}</td>
                    <td
                      className={`py-2 text-right font-medium ${
                        withinBudget ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {withinBudget ? "within" : `${fmt(total - budget)} over`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
}
