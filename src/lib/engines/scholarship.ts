import type {
  Scholarship,
  ScholarshipFilter,
  ScholarshipMatch,
  StudentProfile,
} from "@/lib/domain/types";

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, n));
const round1 = (n: number) => Math.round(n * 10) / 10;

const eqCI = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Scholarship Eligibility Engine (Module 1, Feature 3).
 *
 * Two-stage model:
 *   1. Hard eligibility gates — nationality, level, field, and minimum GPA/IELTS.
 *      Failing any gate yields matchPercent 0 and an explanatory reason. This is
 *      what keeps irrelevant opportunities out.
 *   2. Merit score (for eligible applicants) — how strong a candidate the student
 *      is, blended from GPA headroom above the merit bar, IELTS, and research.
 */
export function scoreScholarship(
  profile: StudentProfile,
  scholarship: Scholarship
): ScholarshipMatch {
  const reasons: string[] = [];

  // --- Stage 1: hard eligibility gates ---
  const nationalityOk =
    scholarship.eligibleNationalities.length === 0 ||
    scholarship.eligibleNationalities.some((n) => eqCI(n, profile.nationality));
  if (!nationalityOk) {
    reasons.push(`Not open to applicants from ${profile.nationality}.`);
  }

  const levelOk =
    scholarship.eligibleLevels.length === 0 ||
    scholarship.eligibleLevels.includes(profile.targetLevel);
  if (!levelOk) {
    reasons.push(`Does not fund ${profile.targetLevel} study.`);
  }

  const fieldOk =
    scholarship.eligibleFields.length === 0 ||
    scholarship.eligibleFields.some((f) => eqCI(f, profile.targetField));
  if (!fieldOk) {
    reasons.push(`Restricted to specific fields (not ${profile.targetField}).`);
  }

  const gpaGateOk = profile.cgpa >= scholarship.minCgpa;
  if (!gpaGateOk) {
    reasons.push(
      `Requires CGPA ≥ ${scholarship.minCgpa.toFixed(
        2
      )} (you have ${profile.cgpa.toFixed(2)}).`
    );
  }

  const ieltsGateOk = profile.ielts >= scholarship.minIelts;
  if (!ieltsGateOk) {
    reasons.push(
      `Requires IELTS ≥ ${scholarship.minIelts.toFixed(
        1
      )} (you have ${profile.ielts.toFixed(1)}).`
    );
  }

  const eligible =
    nationalityOk && levelOk && fieldOk && gpaGateOk && ieltsGateOk;

  if (!eligible) {
    return { scholarship, matchPercent: 0, eligible: false, reasons };
  }

  // --- Stage 2: merit score for eligible applicants ---
  // GPA headroom above the merit bar (60% of score).
  const gpaHeadroom =
    scholarship.meritCgpa > scholarship.minCgpa
      ? (profile.cgpa - scholarship.minCgpa) /
        (scholarship.meritCgpa - scholarship.minCgpa)
      : 1;
  const gpaScore = clamp(gpaHeadroom, 0, 1.1) * 60;

  // IELTS strength relative to a 7.0 "strong" reference (25%).
  const ieltsScore = clamp(profile.ielts / 7.0, 0, 1.1) * 25;

  // Research bonus (15% when valued, otherwise a small nod).
  const researchCap = scholarship.valuesResearch ? 15 : 6;
  const researchScore = clamp(profile.researchPapers * 5, 0, researchCap);

  const matchPercent = round1(clamp(gpaScore + ieltsScore + researchScore));

  reasons.push("Eligible — all gates passed.");
  if (profile.cgpa >= scholarship.meritCgpa)
    reasons.push("Strong merit candidate (GPA at/above merit bar).");
  if (scholarship.valuesResearch && profile.researchPapers >= 1)
    reasons.push("Research output boosts your standing.");

  return { scholarship, matchPercent, eligible: true, reasons };
}

/** Score many scholarships and return eligible ones first, best match on top. */
export function matchScholarships(
  profile: StudentProfile,
  scholarships: Scholarship[]
): ScholarshipMatch[] {
  return scholarships
    .map((s) => scoreScholarship(profile, s))
    .sort((a, b) => {
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      return b.matchPercent - a.matchPercent;
    });
}

const daysUntil = (d: string | Date | null | undefined): number | null => {
  if (!d) return null;
  const t = new Date(d).getTime();
  if (Number.isNaN(t)) return null;
  return Math.ceil((t - Date.now()) / (24 * 60 * 60 * 1000));
};

/**
 * Apply the Scholarship-wizard filters (Phase 5) on top of scored matches.
 * Pure and order-preserving — callers pass the output of `matchScholarships`.
 */
export function filterScholarships(
  matches: ScholarshipMatch[],
  filter: ScholarshipFilter
): ScholarshipMatch[] {
  const eqCILocal = (a: string, b: string) =>
    a.trim().toLowerCase() === b.trim().toLowerCase();

  return matches.filter(({ scholarship: s }) => {
    if (filter.countries && filter.countries.length > 0) {
      const hosts = s.hostCountries ?? [];
      if (!hosts.some((h) => filter.countries!.some((c) => eqCILocal(c, h))))
        return false;
    }
    if (filter.fundingType && filter.fundingType !== "ALL") {
      if ((s.funding ?? "PARTIAL") !== filter.fundingType) return false;
    }
    if (filter.coverage && filter.coverage !== "ALL") {
      if ((s.coverage ?? "PARTIAL") !== filter.coverage) return false;
    }
    if (filter.need === "NEED" && !s.needBased) return false;
    if (filter.need === "MERIT" && !s.meritBased) return false;
    if (filter.deadlineWithinDays) {
      const d = daysUntil(s.deadlineAt);
      if (d == null || d < 0 || d > filter.deadlineWithinDays) return false;
    }
    if (filter.renewable && !s.renewable) return false;
    if (filter.noAppFee && !s.noAppFee) return false;
    if (filter.livingAllowance && !s.livingAllowance) return false;
    return true;
  });
}
