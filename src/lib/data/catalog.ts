import { db } from "@/lib/db";
import type {
  Program,
  Scholarship,
  DegreeLevel,
  CountryInfo,
} from "@/lib/domain/types";

const toLevel = (l: "BACHELORS" | "MASTERS" | "PHD"): DegreeLevel =>
  l === "BACHELORS" ? "bachelors" : l === "PHD" ? "phd" : "masters";

/** Published programs mapped to the engine's Program shape. */
export async function getPublishedPrograms(): Promise<Program[]> {
  const rows = await db.program.findMany({
    where: { published: true },
    include: { university: { select: { name: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    university: r.university.name,
    programName: r.programName,
    field: r.field,
    level: toLevel(r.level),
    selectivity: r.selectivity,
    minCgpa: r.minCgpa,
    minIelts: r.minIelts,
    admitCgpa: r.admitCgpa,
    admitIelts: r.admitIelts,
    valuesResearch: r.valuesResearch,
  }));
}

export interface CostProgram {
  id: string;
  label: string;
  tuitionUsd: number | null;
  countryName: string | null;
  monthlyLivingUsd: number | null;
}

/** Published programs with tuition + their country's living cost (Cost Calculator). */
export async function getProgramsWithCost(): Promise<CostProgram[]> {
  const rows = await db.program.findMany({
    where: { published: true },
    orderBy: { programName: "asc" },
    include: {
      university: {
        select: {
          name: true,
          country: {
            select: { name: true, monthlyLivingCostUsd: true },
          },
        },
      },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    label: `${r.university.name} — ${r.programName}`,
    tuitionUsd: r.tuitionUsd,
    countryName: r.university.country?.name ?? null,
    monthlyLivingUsd: r.university.country?.monthlyLivingCostUsd ?? null,
  }));
}

/** All countries with macro data, for the Country Decision Dashboard. */
export async function getCountries(): Promise<CountryInfo[]> {
  const rows = await db.country.findMany({ orderBy: { name: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    code: r.code,
    flagEmoji: r.flagEmoji,
    postStudyWorkMonths: r.postStudyWorkMonths,
    monthlyLivingCostUsd: r.monthlyLivingCostUsd,
    costOfLivingIndex: r.costOfLivingIndex,
    partTimeAllowed: r.partTimeAllowed,
    workHoursPerWeek: r.workHoursPerWeek,
    currency: r.currency,
  }));
}

/** Published scholarships mapped to the engine's Scholarship shape. */
export async function getPublishedScholarships(): Promise<Scholarship[]> {
  const rows = await db.scholarship.findMany({ where: { published: true } });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    provider: r.provider,
    eligibleNationalities: r.eligibleNationalities,
    eligibleFields: r.eligibleFields,
    eligibleLevels: r.eligibleLevels.map(toLevel),
    minCgpa: r.minCgpa,
    minIelts: r.minIelts,
    meritCgpa: r.meritCgpa,
    valuesResearch: r.valuesResearch,
    amountUsd: r.amountUsd ?? undefined,
  }));
}
