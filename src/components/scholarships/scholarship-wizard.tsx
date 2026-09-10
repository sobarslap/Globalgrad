"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Award, ExternalLink, Check } from "lucide-react";
import type {
  Scholarship,
  ScholarshipFilter,
  StudentProfile,
} from "@/lib/domain/types";
import { matchScholarships, filterScholarships } from "@/lib/engines/scholarship";
import { Badge } from "@/components/ui/badge";

const daysUntil = (d: string | Date | null | undefined) => {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        checked
          ? "border-primary bg-primary/10 text-primary"
          : "border-border/60 text-muted-foreground hover:border-primary/40"
      }`}
    >
      {checked && <Check className="h-3 w-3" />}
      {label}
    </button>
  );
}

const selectCls =
  "h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ScholarshipWizard({
  profile,
  scholarships,
}: {
  profile: StudentProfile;
  scholarships: Scholarship[];
}) {
  const [step, setStep] = useState(1);
  const [filter, setFilter] = useState<ScholarshipFilter>({
    fundingType: "ALL",
    coverage: "ALL",
    need: "BOTH",
    deadlineWithinDays: null,
  });

  const countries = useMemo(
    () => [...new Set(scholarships.flatMap((s) => s.hostCountries ?? []))].sort(),
    [scholarships]
  );

  const scored = useMemo(() => matchScholarships(profile, scholarships), [profile, scholarships]);
  const results = useMemo(() => filterScholarships(scored, filter), [scored, filter]);
  const eligible = results.filter((r) => r.eligible);

  const upcoming = useMemo(
    () =>
      [...scholarships]
        .filter((s) => daysUntil(s.deadlineAt) != null && daysUntil(s.deadlineAt)! >= 0)
        .sort((a, b) => (daysUntil(a.deadlineAt)! - daysUntil(b.deadlineAt)!))
        .slice(0, 5),
    [scholarships]
  );

  const steps = ["Your profile", "Filters", "Matches"];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        {/* Stepper */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <button
                key={s}
                onClick={() => setStep(n)}
                className="flex items-center gap-2"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : done
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : n}
                </span>
                <span className={`text-sm ${active ? "font-medium" : "text-muted-foreground"}`}>
                  {s}
                </span>
                {n < steps.length && <span className="mx-1 h-px w-6 bg-border" />}
              </button>
            );
          })}
        </div>

        {step === 1 && (
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <h3 className="font-semibold">Matching against your profile</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                ["Nationality", profile.nationality],
                ["Degree level", profile.targetLevel],
                ["Field", profile.targetField],
                ["CGPA", `${profile.cgpa.toFixed(2)} / 4.0`],
                ["IELTS", profile.ielts.toFixed(1)],
                ["Budget", profile.greTotal ? `GRE ${profile.greTotal}` : "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs text-muted-foreground">{k}</div>
                  <div className="text-sm font-medium capitalize">{v}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-6 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Next: choose filters
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Host country</label>
                <select
                  className={selectCls}
                  value={filter.countries?.[0] ?? ""}
                  onChange={(e) =>
                    setFilter((f) => ({
                      ...f,
                      countries: e.target.value ? [e.target.value] : undefined,
                    }))
                  }
                >
                  <option value="">All countries</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Funding</label>
                <select
                  className={selectCls}
                  value={filter.fundingType}
                  onChange={(e) =>
                    setFilter((f) => ({ ...f, fundingType: e.target.value as ScholarshipFilter["fundingType"] }))
                  }
                >
                  <option value="ALL">Any funding</option>
                  <option value="FULLY_FUNDED">Fully funded</option>
                  <option value="PARTIAL">Partial</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Coverage</label>
                <select
                  className={selectCls}
                  value={filter.coverage}
                  onChange={(e) =>
                    setFilter((f) => ({ ...f, coverage: e.target.value as ScholarshipFilter["coverage"] }))
                  }
                >
                  <option value="ALL">Any coverage</option>
                  <option value="FULL">Full</option>
                  <option value="MAJOR">Major</option>
                  <option value="PARTIAL">Partial</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Basis</label>
                <select
                  className={selectCls}
                  value={filter.need}
                  onChange={(e) =>
                    setFilter((f) => ({ ...f, need: e.target.value as ScholarshipFilter["need"] }))
                  }
                >
                  <option value="BOTH">Need & merit</option>
                  <option value="NEED">Need based</option>
                  <option value="MERIT">Merit based</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Deadline</label>
                <select
                  className={selectCls}
                  value={filter.deadlineWithinDays ?? ""}
                  onChange={(e) =>
                    setFilter((f) => ({
                      ...f,
                      deadlineWithinDays: e.target.value
                        ? (Number(e.target.value) as 30 | 60 | 90)
                        : null,
                    }))
                  }
                >
                  <option value="">Any deadline</option>
                  <option value="30">Next 30 days</option>
                  <option value="60">Next 60 days</option>
                  <option value="90">Next 90 days</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Toggle
                label="Renewable"
                checked={!!filter.renewable}
                onChange={(v) => setFilter((f) => ({ ...f, renewable: v }))}
              />
              <Toggle
                label="No application fee"
                checked={!!filter.noAppFee}
                onChange={(v) => setFilter((f) => ({ ...f, noAppFee: v }))}
              />
              <Toggle
                label="Living allowance"
                checked={!!filter.livingAllowance}
                onChange={(v) => setFilter((f) => ({ ...f, livingAllowance: v }))}
              />
            </div>

            <button
              onClick={() => setStep(3)}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Find my eligible scholarships ({eligible.length})
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {eligible.length} of {results.length} filtered scholarships fit your
              profile, ranked by match.
            </p>
            {results.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No scholarships match these filters. Loosen them in step 2.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map(({ scholarship: s, matchPercent, eligible: ok, reasons }) => {
                const d = daysUntil(s.deadlineAt);
                return (
                  <div
                    key={s.id}
                    className={`rounded-2xl border p-5 ${ok ? "border-border/60 bg-card/50" : "border-border/40 bg-card/20 opacity-70"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="mb-1.5 flex flex-wrap gap-1.5">
                          <Badge tone={s.funding === "FULLY_FUNDED" ? "success" : "neutral"}>
                            {s.funding === "FULLY_FUNDED" ? "Fully funded" : "Partial"}
                          </Badge>
                          {s.renewable && <Badge tone="primary">Renewable</Badge>}
                        </div>
                        <h3 className="font-semibold leading-tight">{s.name}</h3>
                        <p className="text-sm text-muted-foreground">{s.provider}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{ok ? `${matchPercent}%` : "—"}</div>
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {ok ? "match" : "not eligible"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {s.amountUsd && <span>~${s.amountUsd.toLocaleString()}</span>}
                      {d != null && (
                        <span className="flex items-center gap-1">
                          <CalendarClock className="h-3 w-3" />
                          {d}d left
                        </span>
                      )}
                    </div>

                    {reasons.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {reasons.slice(0, 3).map((r, i) => (
                          <li key={i} className="text-xs text-muted-foreground">
                            • {r}
                          </li>
                        ))}
                      </ul>
                    )}

                    {s.applicationUrl && (
                      <a
                        href={s.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        Apply <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Upcoming deadlines rail */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Award className="h-4 w-4 text-primary" /> Upcoming deadlines
          </h3>
          <ul className="mt-4 space-y-3">
            {upcoming.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.hostCountries?.[0] ?? s.provider}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-primary">
                  {daysUntil(s.deadlineAt)}d
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
