import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import type {
  Program,
  Scholarship,
  DegreeLevel,
  CountryInfo,
} from "@/lib/domain/types";

const toLevel = (l: "BACHELORS" | "MASTERS" | "PHD"): DegreeLevel =>
  l === "BACHELORS" ? "bachelors" : l === "PHD" ? "phd" : "masters";

/**
 * Catalog reads (published programs/scholarships/countries) are global, rarely
 * changed, and hit on nearly every page, so they are wrapped in `unstable_cache`
 * (D2). All share the `catalog` tag; Content-Manager publish/requirement actions
 * call `revalidateTag("catalog")` to invalidate immediately, and the 1h window is
 * a safety net. See `src/lib/cache.ts` for the shared tag constant.
 */
export const CATALOG_TAG = "catalog";
const cacheOpts = { revalidate: 3600, tags: [CATALOG_TAG] };

/** Published programs mapped to the engine's Program shape. */
export const getPublishedPrograms = unstable_cache(
  _getPublishedPrograms,
  ["catalog:programs"],
  cacheOpts
);
async function _getPublishedPrograms(): Promise<Program[]> {
  const rows = await db.program.findMany({
    where: { published: true },
    include: {
      university: {
        select: { name: true, city: true, country: { select: { name: true } } },
      },
    },
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
    minGre: r.minGre ?? undefined,
    admitGre: r.admitGre ?? undefined,
    tuitionUsd: r.tuitionUsd ?? undefined,
    country: r.university.country?.name ?? undefined,
    city: r.university.city ?? undefined,
    intake: r.intake ?? undefined,
    applicationUrl: r.applicationUrl ?? undefined,
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
export const getProgramsWithCost = unstable_cache(
  _getProgramsWithCost,
  ["catalog:programs-cost"],
  cacheOpts
);
async function _getProgramsWithCost(): Promise<CostProgram[]> {
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
export const getCountries = unstable_cache(
  _getCountries,
  ["catalog:countries"],
  cacheOpts
);
async function _getCountries(): Promise<CountryInfo[]> {
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
export const getPublishedScholarships = unstable_cache(
  _getPublishedScholarships,
  ["catalog:scholarships"],
  cacheOpts
);
async function _getPublishedScholarships(): Promise<Scholarship[]> {
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
    funding: r.funding,
    coverage: r.coverage,
    needBased: r.needBased,
    meritBased: r.meritBased,
    renewable: r.renewable,
    noAppFee: r.noAppFee,
    livingAllowance: r.livingAllowance,
    deadlineAt: r.deadlineAt ?? null,
    applicationUrl: r.applicationUrl ?? undefined,
    hostCountries: r.hostCountries,
  }));
}
