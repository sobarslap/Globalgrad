import { describe, it, expect } from "vitest";
import { scoreScholarship, matchScholarships } from "@/lib/engines/scholarship";
import type { StudentProfile } from "@/lib/domain/types";
import { baseStudent, openScholarship, restrictedScholarship } from "./fixtures";

describe("scoreScholarship", () => {
  it("marks an eligible applicant eligible with a positive match", () => {
    const r = scoreScholarship(baseStudent, openScholarship);
    expect(r.eligible).toBe(true);
    expect(r.matchPercent).toBeGreaterThan(0);
    expect(r.matchPercent).toBeLessThanOrEqual(100);
  });

  it("gates out an ineligible nationality with 0% and a reason", () => {
    const r = scoreScholarship(baseStudent, restrictedScholarship);
    expect(r.eligible).toBe(false);
    expect(r.matchPercent).toBe(0);
    expect(r.reasons.some((x) => /Bangladesh/.test(x))).toBe(true);
  });

  it("gates out when below the GPA floor", () => {
    const weak: StudentProfile = { ...baseStudent, cgpa: 2.8 };
    const r = scoreScholarship(weak, openScholarship);
    expect(r.eligible).toBe(false);
    expect(r.reasons.some((x) => /CGPA/i.test(x))).toBe(true);
  });

  it("gives a higher match to a stronger GPA among eligible applicants", () => {
    const low = scoreScholarship({ ...baseStudent, cgpa: 3.1 }, openScholarship)
      .matchPercent;
    const high = scoreScholarship({ ...baseStudent, cgpa: 3.9 }, openScholarship)
      .matchPercent;
    expect(high).toBeGreaterThan(low);
  });

  it("respects level eligibility", () => {
    const phdOnly = { ...openScholarship, eligibleLevels: ["phd" as const] };
    const r = scoreScholarship(baseStudent, phdOnly);
    expect(r.eligible).toBe(false);
    expect(r.reasons.some((x) => /masters/i.test(x))).toBe(true);
  });
});

describe("matchScholarships", () => {
  it("orders eligible scholarships before ineligible ones", () => {
    const list = matchScholarships(baseStudent, [
      restrictedScholarship,
      openScholarship,
    ]);
    expect(list[0].scholarship.id).toBe(openScholarship.id);
    expect(list[0].eligible).toBe(true);
    expect(list[1].eligible).toBe(false);
  });
});
