import { db } from "@/lib/db";
import type { DegreeLevel } from "@prisma/client";

export interface CompareProgram {
  id: string;
  university: string;
  programName: string;
  field: string;
  level: DegreeLevel;
  selectivity: number;
  minCgpa: number;
  minIelts: number;
  admitCgpa: number;
  admitIelts: number;
  valuesResearch: boolean;
  tuitionUsd: number | null;
  country: string | null;
  postStudyWorkMonths: number | null;
  monthlyLivingUsd: number | null;
}

/** {id, label} for every published program (the compare picker). */
export async function getProgramOptions(): Promise<
  { id: string; label: string }[]
> {
  const rows = await db.program.findMany({
    where: { published: true },
    orderBy: { programName: "asc" },
    include: { university: { select: { name: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    label: `${r.university.name} — ${r.programName}`,
  }));
}

/** Full comparison detail for the selected program ids (max 4). */
export async function getCompareData(ids: string[]): Promise<CompareProgram[]> {
  if (ids.length === 0) return [];
  const rows = await db.program.findMany({
    where: { id: { in: ids.slice(0, 4) }, published: true },
    include: {
      university: {
        select: {
          name: true,
          country: {
            select: {
              name: true,
              postStudyWorkMonths: true,
              monthlyLivingCostUsd: true,
            },
          },
        },
      },
    },
  });
  // Preserve the selection order.
  const order = new Map(ids.map((id, i) => [id, i]));
  return rows
    .map((r) => ({
      id: r.id,
      university: r.university.name,
      programName: r.programName,
      field: r.field,
      level: r.level,
      selectivity: r.selectivity,
      minCgpa: r.minCgpa,
      minIelts: r.minIelts,
      admitCgpa: r.admitCgpa,
      admitIelts: r.admitIelts,
      valuesResearch: r.valuesResearch,
      tuitionUsd: r.tuitionUsd,
      country: r.university.country?.name ?? null,
      postStudyWorkMonths: r.university.country?.postStudyWorkMonths ?? null,
      monthlyLivingUsd: r.university.country?.monthlyLivingCostUsd ?? null,
    }))
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}
