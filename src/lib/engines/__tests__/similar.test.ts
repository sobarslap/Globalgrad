import { describe, it, expect } from "vitest";
import { findSimilar, type ApplicantRecord } from "@/lib/engines/similar";
import type { StudentProfile } from "@/lib/domain/types";

const profile: StudentProfile = {
  cgpa: 3.5,
  ielts: 7.0,
  researchPapers: 1,
  workExperienceMonths: 12,
  targetLevel: "masters",
  targetField: "Computer Science",
  nationality: "Bangladesh",
};

const mk = (
  id: string,
  cgpa: number,
  ielts: number,
  research: number,
  outcomes: ApplicantRecord["outcomes"]
): ApplicantRecord => ({
  id,
  cgpa,
  ielts,
  researchPapers: research,
  targetField: "Computer Science",
  nationality: "Bangladesh",
  outcomes,
});

const applicants: ApplicantRecord[] = [
  mk("near", 3.5, 7.0, 1, [
    { university: "TU Munich", admitted: true, scholarship: true },
    { university: "MIT", admitted: false, scholarship: false },
  ]),
  mk("far", 2.8, 6.0, 0, [
    { university: "Regional State University", admitted: true, scholarship: false },
  ]),
];

describe("findSimilar", () => {
  it("ranks the closest applicant first with the highest similarity", () => {
    const r = findSimilar(profile, applicants, 2);
    expect(r.matches[0].applicant.id).toBe("near");
    expect(r.matches[0].similarity).toBeGreaterThan(r.matches[1].similarity);
  });

  it("computes admit and scholarship rates across matched outcomes", () => {
    const r = findSimilar(profile, applicants, 2);
    // 3 outcomes total, 2 admitted, 1 scholarship
    expect(r.admitRate).toBe(67);
    expect(r.scholarshipRate).toBe(33);
  });

  it("aggregates universities with per-university admit rates", () => {
    const r = findSimilar(profile, applicants, 2);
    const mit = r.topUniversities.find((u) => u.university === "MIT");
    expect(mit?.applications).toBe(1);
    expect(mit?.admits).toBe(0);
    expect(mit?.admitRate).toBe(0);
  });

  it("respects the requested match count", () => {
    const r = findSimilar(profile, applicants, 1);
    expect(r.matches).toHaveLength(1);
    expect(r.count).toBe(1);
  });
});
