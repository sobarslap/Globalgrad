import { describe, it, expect } from "vitest";
import { scoreReadiness, scoreReadinessByTier } from "@/lib/engines/readiness";
import {
  matchScholarships,
  filterScholarships,
} from "@/lib/engines/scholarship";
import type {
  Program,
  Scholarship,
  StudentProfile,
} from "@/lib/domain/types";
import { baseStudent, eliteProgram, midProgram, safeProgram } from "./fixtures";

const greProgram: Program = { ...eliteProgram, id: "gre-cs", minGre: 320 };

describe("scoreReadiness — GRE gate", () => {
  it("flags a weakness when the program requires GRE and the student has none", () => {
    const noGre: StudentProfile = { ...baseStudent, greTotal: undefined };
    const r = scoreReadiness(noGre, greProgram);
    expect(r.meetsMinimums).toBe(false);
    expect(r.flags.some((f) => f.kind === "weakness" && /GRE/i.test(f.label))).toBe(true);
  });

  it("flags a weakness when the GRE is below the minimum", () => {
    const low: StudentProfile = { ...baseStudent, greTotal: 300 };
    const r = scoreReadiness(low, greProgram);
    expect(r.meetsMinimums).toBe(false);
    expect(r.flags.some((f) => f.kind === "weakness" && /GRE below/i.test(f.label))).toBe(true);
  });

  it("adds a strength when the GRE meets the requirement", () => {
    const ok: StudentProfile = { ...baseStudent, greTotal: 325 };
    const r = scoreReadiness(ok, greProgram);
    expect(r.flags.some((f) => f.kind === "strength" && /GRE/i.test(f.label))).toBe(true);
  });

  it("ignores GRE entirely when the program lists no minimum", () => {
    const r = scoreReadiness({ ...baseStudent, greTotal: undefined }, midProgram);
    expect(r.flags.some((f) => /GRE/i.test(f.label))).toBe(false);
  });
});

describe("scoreReadinessByTier", () => {
  const programs = [eliteProgram, midProgram, safeProgram];
  it("returns exactly three tiers in top→accessible order", () => {
    const tiers = scoreReadinessByTier(baseStudent, programs);
    expect(tiers.map((t) => t.tier)).toEqual(["top", "mid", "accessible"]);
  });

  it("assigns programs to the right tier by selectivity band", () => {
    const tiers = scoreReadinessByTier(baseStudent, programs);
    const byTier = Object.fromEntries(tiers.map((t) => [t.tier, t]));
    expect(byTier.top.programCount).toBe(1); // eliteProgram (selectivity 98)
    expect(byTier.mid.programCount).toBe(1); // midProgram (60)
    expect(byTier.accessible.programCount).toBe(1); // safeProgram (25)
  });

  it("recommends proceeding when a tier has no weaknesses", () => {
    const strong: StudentProfile = { ...baseStudent, cgpa: 3.95, ielts: 8, researchPapers: 3 };
    const tiers = scoreReadinessByTier(strong, programs);
    const accessible = tiers.find((t) => t.tier === "accessible")!;
    expect(accessible.weaknesses.length).toBe(0);
    expect(accessible.recommendations.join(" ")).toMatch(/proceed/i);
  });
});

describe("filterScholarships", () => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const scholarships: Scholarship[] = [
    {
      id: "fully-soon", name: "Fully Funded Soon", provider: "X",
      eligibleNationalities: [], eligibleFields: [], eligibleLevels: ["masters"],
      minCgpa: 3.0, minIelts: 6.5, meritCgpa: 3.6, valuesResearch: false,
      funding: "FULLY_FUNDED", coverage: "FULL", needBased: false, meritBased: true,
      renewable: true, noAppFee: true, livingAllowance: true,
      deadlineAt: new Date(now + 20 * day), hostCountries: ["United Kingdom"],
    },
    {
      id: "partial-far", name: "Partial Far", provider: "Y",
      eligibleNationalities: [], eligibleFields: [], eligibleLevels: ["masters"],
      minCgpa: 3.0, minIelts: 6.5, meritCgpa: 3.6, valuesResearch: false,
      funding: "PARTIAL", coverage: "PARTIAL", needBased: true, meritBased: false,
      renewable: false, noAppFee: true, livingAllowance: false,
      deadlineAt: new Date(now + 200 * day), hostCountries: ["Germany"],
    },
  ];

  it("filters by funding type", () => {
    const matches = matchScholarships(baseStudent, scholarships);
    const out = filterScholarships(matches, { fundingType: "FULLY_FUNDED" });
    expect(out.map((m) => m.scholarship.id)).toEqual(["fully-soon"]);
  });

  it("filters by deadline window", () => {
    const matches = matchScholarships(baseStudent, scholarships);
    const out = filterScholarships(matches, { deadlineWithinDays: 30 });
    expect(out.every((m) => m.scholarship.id === "fully-soon")).toBe(true);
  });

  it("filters by renewable flag and host country", () => {
    const matches = matchScholarships(baseStudent, scholarships);
    expect(filterScholarships(matches, { renewable: true })).toHaveLength(1);
    expect(
      filterScholarships(matches, { countries: ["Germany"] }).map((m) => m.scholarship.id)
    ).toEqual(["partial-far"]);
  });
});
