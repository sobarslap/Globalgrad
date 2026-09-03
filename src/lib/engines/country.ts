import type { CountryInfo } from "@/lib/domain/types";

export interface CountryWeights {
  /** Prefer lower living cost. */
  affordability: number;
  /** Prefer longer post-study work visa. */
  workVisa: number;
  /** Prefer more permitted part-time hours. */
  partTime: number;
}

export const defaultWeights: CountryWeights = {
  affordability: 0.4,
  workVisa: 0.4,
  partTime: 0.2,
};

export interface RankedCountry {
  country: CountryInfo;
  score: number; // 0–100
  breakdown: { affordability: number; workVisa: number; partTime: number };
}

/** Min–max normalize a value across the set; returns 0–100 (50 if no spread). */
function norm(value: number, min: number, max: number, invert = false): number {
  if (max === min) return 50;
  const t = (value - min) / (max - min);
  return Math.round((invert ? 1 - t : t) * 100);
}

/**
 * Rank countries on macro "fit" — affordability (inverse living cost), post-study
 * work visa length, and part-time hours — normalized across the given set and
 * combined with the user's priority weights. Not academic matching.
 */
export function rankCountries(
  countries: CountryInfo[],
  weights: CountryWeights = defaultWeights
): RankedCountry[] {
  const costs = countries.map((c) => c.monthlyLivingCostUsd ?? 0);
  const visas = countries.map((c) => c.postStudyWorkMonths ?? 0);
  const hours = countries.map((c) => c.workHoursPerWeek ?? 0);
  const minCost = Math.min(...costs),
    maxCost = Math.max(...costs);
  const minVisa = Math.min(...visas),
    maxVisa = Math.max(...visas);
  const minHours = Math.min(...hours),
    maxHours = Math.max(...hours);

  const wSum =
    weights.affordability + weights.workVisa + weights.partTime || 1;

  return countries
    .map((country) => {
      const affordability = norm(
        country.monthlyLivingCostUsd ?? maxCost,
        minCost,
        maxCost,
        true // lower cost = better
      );
      const workVisa = norm(
        country.postStudyWorkMonths ?? 0,
        minVisa,
        maxVisa
      );
      const partTime = norm(country.workHoursPerWeek ?? 0, minHours, maxHours);

      const score = Math.round(
        (affordability * weights.affordability +
          workVisa * weights.workVisa +
          partTime * weights.partTime) /
          wSum
      );

      return {
        country,
        score,
        breakdown: { affordability, workVisa, partTime },
      };
    })
    .sort((a, b) => b.score - a.score);
}
