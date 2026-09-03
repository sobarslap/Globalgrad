"use client";

import { useMemo, useState } from "react";
import { Briefcase, Coins, Clock } from "lucide-react";
import {
  rankCountries,
  defaultWeights,
  type CountryWeights,
} from "@/lib/engines/country";
import type { CountryInfo } from "@/lib/domain/types";
import { Button } from "@/components/ui/button";

const presets: { key: string; label: string; weights: CountryWeights }[] = [
  { key: "balanced", label: "Balanced", weights: defaultWeights },
  {
    key: "budget",
    label: "Cheapest first",
    weights: { affordability: 0.7, workVisa: 0.2, partTime: 0.1 },
  },
  {
    key: "career",
    label: "Best for work",
    weights: { affordability: 0.15, workVisa: 0.6, partTime: 0.25 },
  },
];

function Bar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function CountryDashboard({ countries }: { countries: CountryInfo[] }) {
  const [preset, setPreset] = useState("balanced");
  const weights =
    presets.find((p) => p.key === preset)?.weights ?? defaultWeights;
  const ranked = useMemo(
    () => rankCountries(countries, weights),
    [countries, weights]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted-foreground">
          Rank by priority:
        </span>
        {presets.map((p) => (
          <Button
            key={p.key}
            size="sm"
            variant={preset === p.key ? "default" : "outline"}
            onClick={() => setPreset(p.key)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ranked.map(({ country, score, breakdown }, i) => (
          <div
            key={country.id}
            className="rounded-2xl border border-border/60 bg-card/50 p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{country.flagEmoji ?? "🏳️"}</span>
                <div>
                  <p className="font-semibold leading-tight">{country.name}</p>
                  <p className="text-xs text-muted-foreground">
                    #{i + 1} · {country.currency}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-[10px] uppercase tracking-wide text-primary">
                  Fit
                </div>
              </div>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" /> Post-study work
                </dt>
                <dd className="font-medium">
                  {country.postStudyWorkMonths
                    ? `${country.postStudyWorkMonths} mo`
                    : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Coins className="h-4 w-4" /> Living cost / mo
                </dt>
                <dd className="font-medium">
                  {country.monthlyLivingCostUsd
                    ? `$${country.monthlyLivingCostUsd.toLocaleString()}`
                    : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" /> Part-time
                </dt>
                <dd className="font-medium">
                  {country.partTimeAllowed
                    ? `${country.workHoursPerWeek ?? "?"} h/wk`
                    : "Not allowed"}
                </dd>
              </div>
            </dl>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-24 shrink-0">Affordability</span>
                <Bar value={breakdown.affordability} />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-24 shrink-0">Work visa</span>
                <Bar value={breakdown.workVisa} />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-24 shrink-0">Part-time</span>
                <Bar value={breakdown.partTime} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Figures are indicative and for comparison only — always verify visa rules
        and costs with official government and university sources before deciding.
      </p>
    </div>
  );
}
