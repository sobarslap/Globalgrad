"use client";

import type { MatchingResult, ProgramMatch, ScholarshipMatch } from "@/lib/domain/types";

const bucketMeta = {
  safe: {
    label: "Safe",
    ring: "border-emerald-500/40",
    dot: "bg-emerald-500",
    text: "text-emerald-500",
  },
  target: {
    label: "Target",
    ring: "border-amber-500/40",
    dot: "bg-amber-500",
    text: "text-amber-500",
  },
  reach: {
    label: "Reach",
    ring: "border-rose-500/40",
    dot: "bg-rose-500",
    text: "text-rose-500",
  },
} as const;

function ProgramCard({ match }: { match: ProgramMatch }) {
  const meta = bucketMeta[match.bucket];
  return (
    <div className={`rounded-xl border ${meta.ring} bg-card/50 p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium leading-tight">{match.program.university}</p>
          <p className="text-sm text-muted-foreground">
            {match.program.programName}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{match.score}</div>
          <div className={`text-xs uppercase tracking-wide ${meta.text}`}>
            {meta.label}
          </div>
        </div>
      </div>
      {match.flags.length > 0 && (
        <ul className="mt-3 space-y-1">
          {match.flags.slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-xs">
              <span
                className={
                  f.kind === "strength"
                    ? "mt-0.5 text-emerald-500"
                    : "mt-0.5 text-rose-500"
                }
              >
                {f.kind === "strength" ? "▲" : "▼"}
              </span>
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{f.label}.</span>{" "}
                {f.detail}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Bucket({
  title,
  matches,
  kind,
}: {
  title: string;
  matches: ProgramMatch[];
  kind: keyof typeof bucketMeta;
}) {
  const meta = bucketMeta[kind];
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
        <h3 className="font-semibold">{title}</h3>
        <span className="text-sm text-muted-foreground">({matches.length})</span>
      </div>
      <div className="space-y-3">
        {matches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No programs in this bucket.</p>
        ) : (
          matches.map((m) => <ProgramCard key={m.program.id} match={m} />)
        )}
      </div>
    </div>
  );
}

export function Results({
  matching,
  scholarships,
}: {
  matching: MatchingResult;
  scholarships: ScholarshipMatch[];
}) {
  const eligible = scholarships.filter((s) => s.eligible);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-1 text-xl font-semibold">University matching</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Programs sorted by your readiness score into Safe / Target / Reach.
        </p>
        <div className="grid gap-6 lg:grid-cols-3">
          <Bucket title="Safe" kind="safe" matches={matching.safe} />
          <Bucket title="Target" kind="target" matches={matching.target} />
          <Bucket title="Reach" kind="reach" matches={matching.reach} />
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-xl font-semibold">Scholarship matches</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          {eligible.length} of {scholarships.length} scholarships fit your
          profile, ranked by funding-match percentage.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {scholarships.map((s) => (
            <div
              key={s.scholarship.id}
              className={`rounded-xl border p-4 ${
                s.eligible ? "border-border" : "border-border/40 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium leading-tight">{s.scholarship.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {s.scholarship.provider}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {s.eligible ? `${s.matchPercent}%` : "—"}
                  </div>
                  <div
                    className={`text-xs uppercase tracking-wide ${
                      s.eligible ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {s.eligible ? "Match" : "Not eligible"}
                  </div>
                </div>
              </div>
              {s.reasons.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {s.reasons[0]}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
