import { describe, it, expect } from "vitest";
import { rankCountries } from "@/lib/engines/country";
import type { CountryInfo } from "@/lib/domain/types";

const mk = (
  name: string,
  monthlyLivingCostUsd: number,
  postStudyWorkMonths: number,
  workHoursPerWeek: number
): CountryInfo => ({
  id: name,
  name,
  code: name.slice(0, 2).toUpperCase(),
  flagEmoji: null,
  postStudyWorkMonths,
  monthlyLivingCostUsd,
  costOfLivingIndex: null,
  partTimeAllowed: true,
  workHoursPerWeek,
  currency: "USD",
});

const countries = [
  mk("Expensive", 2000, 6, 15),
  mk("Cheap", 900, 12, 40),
  mk("Balanced", 1200, 36, 24),
];

describe("rankCountries", () => {
  it("returns a score 0–100 and a breakdown for each", () => {
    const r = rankCountries(countries);
    expect(r).toHaveLength(3);
    for (const c of r) {
      expect(c.score).toBeGreaterThanOrEqual(0);
      expect(c.score).toBeLessThanOrEqual(100);
      expect(c.breakdown.affordability).toBeGreaterThanOrEqual(0);
    }
  });

  it("is sorted by score descending", () => {
    const scores = rankCountries(countries).map((c) => c.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it("ranks the cheapest country first when affordability is weighted heavily", () => {
    const r = rankCountries(countries, {
      affordability: 1,
      workVisa: 0,
      partTime: 0,
    });
    expect(r[0].country.name).toBe("Cheap");
  });

  it("ranks the longest work-visa country first when that is weighted", () => {
    const r = rankCountries(countries, {
      affordability: 0,
      workVisa: 1,
      partTime: 0,
    });
    expect(r[0].country.name).toBe("Balanced"); // 36 months
  });
});
