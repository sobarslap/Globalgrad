import { redirect } from "next/navigation";
import { GitCompareArrows } from "lucide-react";
import { auth } from "@/lib/auth";
import { getProgramOptions, getCompareData } from "@/lib/data/compare";
import { getMyProfile } from "@/lib/actions/profile";
import { scoreReadiness } from "@/lib/engines/readiness";
import { REALITY_CHECKS } from "@/lib/data/reality";
import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/components/ui/program-card";

export const metadata = { title: "Compare — GlobalGrad" };

const label = (s: string) =>
  s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

function toIds(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string | string[] }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const sp = await searchParams;
  const ids = toIds(sp.ids).slice(0, 4);

  const [options, programs, profile] = await Promise.all([
    getProgramOptions(),
    getCompareData(ids),
    getMyProfile(),
  ]);

  const reality = new Map(REALITY_CHECKS.map((r) => [r.university, r]));

  // Readiness per compared program (only when a profile exists).
  const readiness = new Map(
    profile
      ? programs.map((p) => [
          p.id,
          scoreReadiness(profile, {
            id: p.id,
            university: p.university,
            programName: p.programName,
            field: p.field,
            level: p.level === "BACHELORS" ? "bachelors" : p.level === "PHD" ? "phd" : "masters",
            selectivity: p.selectivity,
            minCgpa: p.minCgpa,
            minIelts: p.minIelts,
            admitCgpa: p.admitCgpa,
            admitIelts: p.admitIelts,
            valuesResearch: p.valuesResearch,
          }),
        ])
      : []
  );

  const rows: { label: string; get: (p: (typeof programs)[number]) => string }[] = [
    { label: "Field", get: (p) => p.field },
    { label: "Level", get: (p) => label(p.level) },
    { label: "Selectivity", get: (p) => `${Math.round(p.selectivity)}/100` },
    {
      label: "Tuition / yr",
      get: (p) => (p.tuitionUsd ? `$${p.tuitionUsd.toLocaleString()}` : "—"),
    },
    { label: "Country", get: (p) => p.country ?? "—" },
    {
      label: "Post-study work",
      get: (p) => (p.postStudyWorkMonths ? `${p.postStudyWorkMonths} mo` : "—"),
    },
    {
      label: "Living cost / mo",
      get: (p) =>
        p.monthlyLivingUsd ? `$${p.monthlyLivingUsd.toLocaleString()}` : "—",
    },
    { label: "Values research", get: (p) => (p.valuesResearch ? "Yes" : "No") },
    {
      label: "Housing difficulty",
      get: (p) => {
        const r = reality.get(p.university);
        return r ? `${r.housingDifficulty}/5` : "—";
      },
    },
    {
      label: "Student satisfaction",
      get: (p) => {
        const r = reality.get(p.university);
        return r ? `${r.studentSatisfaction}/5` : "—";
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <main id="main-content" className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <GitCompareArrows className="h-6 w-6 text-primary" /> Compare programs
          </h1>
          <p className="mt-1 text-muted-foreground">
            Pick up to four programs to compare side by side.
          </p>
        </div>

        <form method="get" className="space-y-3">
          <div className="grid max-h-56 grid-cols-1 gap-1 overflow-y-auto rounded-xl border border-border/60 p-3 sm:grid-cols-2">
            {options.map((o) => (
              <label
                key={o.id}
                className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent/50"
              >
                <input
                  type="checkbox"
                  name="ids"
                  value={o.id}
                  defaultChecked={ids.includes(o.id)}
                  className="h-4 w-4"
                />
                {o.label}
              </label>
            ))}
          </div>
          <Button type="submit">Compare selected</Button>
        </form>

        {programs.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p) => {
              const r = readiness.get(p.id);
              return (
                <ProgramCard
                  key={p.id}
                  meta={p.country ?? p.field}
                  title={p.university}
                  subtitle={p.programName}
                  progress={r ? r.score : p.selectivity}
                  accent={r ? r.bucket : "neutral"}
                  progressLabel={r ? "Your readiness" : "Selectivity"}
                />
              );
            })}
          </div>
        )}

        {programs.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="p-3 text-left font-medium text-muted-foreground">
                    Attribute
                  </th>
                  {programs.map((p) => (
                    <th key={p.id} className="p-3 text-left font-semibold">
                      {p.university}
                      <div className="text-xs font-normal text-muted-foreground">
                        {p.programName}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profile && (
                  <tr className="border-b border-border/40 bg-primary/5">
                    <td className="p-3 font-medium">Your readiness</td>
                    {programs.map((p) => {
                      const r = readiness.get(p.id);
                      return (
                        <td key={p.id} className="p-3">
                          {r ? (
                            <span className="font-semibold">
                              {r.score}{" "}
                              <span className="text-xs uppercase text-muted-foreground">
                                {r.bucket}
                              </span>
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )}
                {rows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-border/40 last:border-0"
                  >
                    <td className="p-3 font-medium text-muted-foreground">
                      {row.label}
                    </td>
                    {programs.map((p) => (
                      <td key={p.id} className="p-3">
                        {row.get(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Select programs above and click Compare.
          </p>
        )}
      </main>
    </div>
  );
}
