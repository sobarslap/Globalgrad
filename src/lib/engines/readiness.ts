import type {
  Program,
  ReadinessFlag,
  ReadinessResult,
  StudentProfile,
  MatchBucket,
} from "@/lib/domain/types";

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, n));

/** Round to one decimal so results are stable and easy to assert in tests. */
const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Score a student's readiness for a single program on a 0–100 scale, and
 * classify it into Safe / Target / Reach relative to the program's selectivity.
 *
 * The score blends four weighted components:
 *   - GPA fit     (40%)  — student CGPA vs the program's typical admit CGPA
 *   - Test fit    (30%)  — IELTS vs typical admit IELTS
 *   - Research    (up to 15%) — publications, weighted more where research matters
 *   - Experience  (up to 15%) — relevant months of work/internship
 *
 * Falling below a hard minimum applies a penalty and raises a weakness flag,
 * but never hard-rejects — the student should still see the gap.
 */
export function scoreReadiness(
  profile: StudentProfile,
  program: Program
): ReadinessResult {
  const flags: ReadinessFlag[] = [];

  // --- GPA component (40) ---
  // Ratio of student CGPA to admit CGPA, centered so meeting the average ≈ full marks.
  const gpaRatio = program.admitCgpa > 0 ? profile.cgpa / program.admitCgpa : 1;
  const gpaComponent = clamp(gpaRatio * 40, 0, 44); // small over-cap rewards strong GPAs

  // --- Test component (30) ---
  const ieltsRatio =
    program.admitIelts > 0 ? profile.ielts / program.admitIelts : 1;
  const testComponent = clamp(ieltsRatio * 30, 0, 33);

  // --- Research component (up to 15) ---
  const researchWeight = program.valuesResearch ? 7.5 : 3;
  const researchComponent = clamp(
    profile.researchPapers * researchWeight,
    0,
    15
  );

  // --- Experience component (up to 15) ---
  // ~2 years of relevant experience saturates the component.
  const experienceComponent = clamp(
    (profile.workExperienceMonths / 24) * 15,
    0,
    15
  );

  let score =
    gpaComponent + testComponent + researchComponent + experienceComponent;

  // --- Hard-minimum penalties + flags ---
  let meetsMinimums = true;
  if (profile.cgpa < program.minCgpa) {
    meetsMinimums = false;
    score -= 12;
    flags.push({
      kind: "weakness",
      label: "CGPA below minimum",
      detail: `Program requires ${program.minCgpa.toFixed(
        2
      )}; you have ${profile.cgpa.toFixed(2)}.`,
    });
  }
  if (profile.ielts < program.minIelts) {
    meetsMinimums = false;
    score -= 10;
    flags.push({
      kind: "weakness",
      label: "IELTS below minimum",
      detail: `Program requires ${program.minIelts.toFixed(
        1
      )}; you have ${profile.ielts.toFixed(1)}.`,
    });
  }

  // --- Strength flags ---
  if (profile.cgpa >= program.admitCgpa) {
    flags.push({
      kind: "strength",
      label: "Competitive CGPA",
      detail: `At or above the typical admit average (${program.admitCgpa.toFixed(
        2
      )}).`,
    });
  }
  if (profile.ielts >= program.admitIelts) {
    flags.push({
      kind: "strength",
      label: "Strong English proficiency",
      detail: `IELTS ${profile.ielts.toFixed(1)} meets the admit average.`,
    });
  }
  if (program.valuesResearch && profile.researchPapers >= 1) {
    flags.push({
      kind: "strength",
      label: "Research output",
      detail: `${profile.researchPapers} paper(s) — valued by this research-focused program.`,
    });
  }
  if (profile.workExperienceMonths >= 12) {
    flags.push({
      kind: "strength",
      label: "Relevant experience",
      detail: `${profile.workExperienceMonths} months strengthens your application.`,
    });
  }

  score = round1(clamp(score));

  return {
    score,
    bucket: bucketFor(score, program.selectivity),
    flags,
    meetsMinimums,
  };
}

/**
 * Translate a readiness score into a bucket. More selective programs demand a
 * higher score to be considered "Safe", so the thresholds shift with selectivity.
 */
export function bucketFor(score: number, selectivity: number): MatchBucket {
  // selectivity 0 → safe≥65 / target≥40 ; selectivity 100 → safe≥85 / target≥60
  const safeThreshold = 65 + (selectivity / 100) * 20;
  const targetThreshold = 40 + (selectivity / 100) * 20;
  if (score >= safeThreshold) return "safe";
  if (score >= targetThreshold) return "target";
  return "reach";
}
