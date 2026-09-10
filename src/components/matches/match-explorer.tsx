"use client";

import { useMemo, useState } from "react";
import { GraduationCap, MapPin, ExternalLink } from "lucide-react";
import type { Program, StudentProfile } from "@/lib/domain/types";
import { matchPrograms } from "@/lib/engines/matching";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { TrackButton } from "@/components/applications/track-button";

type Bucket = "all" | "safe" | "target" | "reach";

const bucketTone = { safe: "safe", target: "target", reach: "reach" } as const;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/40 px-2.5 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function MatchCard({
  match,
}: {
  match: ReturnType<typeof matchPrograms>["all"][number];
}) {
  const p = match.program;
  const tone = bucketTone[match.bucket];
  return (
    <div className="flex flex-col rounded-2xl border border-border/60 bg-card/50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <Badge tone={tone}>{match.bucket.toUpperCase()}</Badge>
            <Badge tone="neutral">{p.field}</Badge>
          </div>
          <h3 className="truncate font-semibold leading-tight">{p.programName}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{p.university}</span>
          </p>
          {(p.city || p.country) && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              {[p.city, p.country].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold leading-none">{match.score}</div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            readiness
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1.5">
        <Stat label="Tuition/yr" value={p.tuitionUsd ? `$${(p.tuitionUsd / 1000).toFixed(0)}k` : "—"} />
        <Stat label="Min CGPA" value={p.minCgpa.toFixed(2)} />
        <Stat label="IELTS" value={p.minIelts.toFixed(1)} />
        <Stat label="GRE" value={p.minGre ? String(p.minGre) : "—"} />
      </div>

      <div className="mt-3">
        <p className="mb-1.5 text-xs font-medium text-foreground">Why this match</p>
        <ul className="space-y-1">
          {match.flags.map((f, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs">
              <span className={f.kind === "strength" ? "mt-0.5 text-emerald-500" : "mt-0.5 text-rose-500"}>
                {f.kind === "strength" ? "▲" : "▼"}
              </span>
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{f.label}.</span> {f.detail}
              </span>
            </li>
          ))}
          {match.flags.length === 0 && (
            <li className="text-xs text-muted-foreground">
              Meets the listed requirements — a balanced fit for your profile.
            </li>
          )}
        </ul>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <TrackButton programId={p.id} />
        {p.applicationUrl && (
          <a
            href={p.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            Program page <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export function MatchExplorer({
  profile,
  programs,
}: {
  profile: StudentProfile;
  programs: Program[];
}) {
  const [bucket, setBucket] = useState<Bucket>("all");
  const [country, setCountry] = useState<string>("");
  const [field, setField] = useState<string>("");
  const [maxTuition, setMaxTuition] = useState<number>(0);

  const countries = useMemo(
    () => [...new Set(programs.map((p) => p.country).filter(Boolean))].sort() as string[],
    [programs]
  );
  const fields = useMemo(
    () => [...new Set(programs.map((p) => p.field))].sort(),
    [programs]
  );

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      if (country && p.country !== country) return false;
      if (field && p.field !== field) return false;
      if (maxTuition > 0 && (p.tuitionUsd ?? 0) > maxTuition) return false;
      return true;
    });
  }, [programs, country, field, maxTuition]);

  const matching = useMemo(() => matchPrograms(profile, filtered), [profile, filtered]);

  const list =
    bucket === "all" ? matching.all : matching[bucket];

  const selectCls =
    "h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <select className={selectCls} value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className={selectCls} value={field} onChange={(e) => setField(e.target.value)}>
          <option value="">All fields</option>
          {fields.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <select
          className={selectCls}
          value={maxTuition}
          onChange={(e) => setMaxTuition(Number(e.target.value))}
        >
          <option value={0}>Any tuition</option>
          <option value={5000}>≤ $5k/yr</option>
          <option value={15000}>≤ $15k/yr</option>
          <option value={30000}>≤ $30k/yr</option>
          <option value={50000}>≤ $50k/yr</option>
        </select>
      </div>

      <Tabs
        value={bucket}
        onChange={(v) => setBucket(v as Bucket)}
        items={[
          { value: "all", label: "All", count: matching.all.length },
          { value: "safe", label: "Safe", count: matching.safe.length },
          { value: "target", label: "Target", count: matching.target.length },
          { value: "reach", label: "Reach", count: matching.reach.length },
        ]}
      />

      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No programs match these filters. Widen your filters to see more options.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((m) => (
            <MatchCard key={m.program.id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}
