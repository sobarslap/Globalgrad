import { describe, it, expect } from "vitest";
import { scoreReadiness, bucketFor } from "@/lib/engines/readiness";
import type { StudentProfile } from "@/lib/domain/types";
import { baseStudent, eliteProgram, midProgram, safeProgram } from "./fixtures";

describe("scoreReadiness", () => {
  it("returns a score within 0–100", () => {
    const r = scoreReadiness(baseStudent, midProgram);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });

  it("classifies a strong-vs-easy program as safe", () => {
    const r = scoreReadiness(baseStudent, safeProgram);
    expect(r.bucket).toBe("safe");
    expect(r.meetsMinimums).toBe(true);
  });

  it("classifies an average applicant to an elite program as reach or target", () => {
    const r = scoreReadiness(baseStudent, eliteProgram);
    expect(["reach", "target"]).toContain(r.bucket);
    // Elite program: student sits exactly at the minimums, below admit averages.
    expect(r.score).toBeLessThan(
      scoreReadiness(baseStudent, safeProgram).score
    );
  });

  it("flags a weakness and marks minimums unmet when below the IELTS floor", () => {
    const weak: StudentProfile = { ...baseStudent, ielts: 6.0 };
    const r = scoreReadiness(weak, eliteProgram);
    expect(r.meetsMinimums).toBe(false);
    expect(r.flags.some((f) => f.kind === "weakness" && /IELTS/i.test(f.label))).toBe(
      true
    );
  });

  it("adds a research strength for research-focused programs", () => {
    const r = scoreReadiness(baseStudent, eliteProgram);
    expect(
      r.flags.some((f) => f.kind === "strength" && /Research/i.test(f.label))
    ).toBe(true);
  });

  it("rewards a higher GPA with a higher score (monotonic)", () => {
    const low = scoreReadiness({ ...baseStudent, cgpa: 3.0 }, midProgram).score;
    const high = scoreReadiness({ ...baseStudent, cgpa: 3.9 }, midProgram).score;
    expect(high).toBeGreaterThan(low);
  });

  it("is deterministic", () => {
    const a = scoreReadiness(baseStudent, midProgram);
    const b = scoreReadiness(baseStudent, midProgram);
    expect(a).toEqual(b);
  });
});

describe("bucketFor", () => {
  it("requires a higher score to be safe at higher selectivity", () => {
    // A score of 70 is safe at an easy school but not at a very selective one.
    expect(bucketFor(70, 10)).toBe("safe");
    expect(bucketFor(70, 100)).not.toBe("safe");
  });
});
