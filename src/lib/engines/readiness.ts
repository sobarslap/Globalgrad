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
  // GRE gate — only when the program lists a minimum. A missing score on a
  // GRE-required program is itself a gap the student should see.
  if (program.minGre) {
    if (profile.greTotal == null) {
      meetsMinimums = false;
      score -= 8;
      flags.push({
        kind: "weakness",
        label: "GRE required",
        detail: `Program lists a GRE minimum of ${program.minGre}; no GRE score on your profile.`,
      });
    } else if (profile.greTotal < program.minGre) {
      meetsMinimums = false;
      score -= 8;
      flags.push({
        kind: "weakness",
        label: "GRE below minimum",
        detail: `Program requires GRE ≥ ${program.minGre}; you have ${profile.greTotal}.`,
      });
    }
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
  if (program.minGre && profile.greTotal != null && profile.greTotal >= program.minGre) {
    flags.push({
      kind: "strength",
      label: "GRE meets requirement",
      detail: `GRE ${profile.greTotal} meets the listed minimum of ${program.minGre}.`,
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

/**
 * Tier-level readiness scorecard (StudyCompass-style). Groups programs into
 * Top / Mid / Accessible tiers by selectivity band, then aggregates the
 * per-program readiness flags into a de-duplicated set of strengths,
 * weaknesses, and actionable recommendations per tier.
 */
export type ReadinessTier = "top" | "mid" | "accessible";

export interface TierReadiness {
  tier: ReadinessTier;
  label: string; // "Top-tier" | "Mid-tier" | "Accessible-tier"
  score: number; // 0–100, averaged across programs in the band
  programCount: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const TIER_META: Record<ReadinessTier, { label: string; min: number; max: number }> = {
  top: { label: "Top-tier", min: 66, max: 101 },
  mid: { label: "Mid-tier", min: 33, max: 66 },
  accessible: { label: "Accessible-tier", min: 0, max: 33 },
};

/** Map a recurring weakness label to a concrete recommendation. */
function recommendationFor(label: string): string {
  if (label.startsWith("CGPA"))
    return "Prioritize programs with flexible GPA requirements, or strengthen your profile with projects, research, and strong references.";
  if (label.startsWith("IELTS"))
    return "Retake IELTS/TOEFL to lift your band before applying to this tier.";
  if (label.startsWith("GRE"))
    return "Sit or resit the GRE — several programs in this tier gate on it.";
  return "Pair this tier with scholarship searches and lower-cost country options.";
}

export function scoreReadinessByTier(
  profile: StudentProfile,
  programs: Program[]
): TierReadiness[] {
  const tiers: ReadinessTier[] = ["top", "mid", "accessible"];
  return tiers.map((tier) => {
    const meta = TIER_META[tier];
    const inBand = programs.filter(
      (p) => p.selectivity >= meta.min && p.selectivity < meta.max
    );
    const results = inBand.map((p) => scoreReadiness(profile, p));

    const avg =
      results.length > 0
        ? round1(results.reduce((s, r) => s + r.score, 0) / results.length)
        : 0;

    // De-duplicate flags by label, keeping the first (most representative) detail.
    const seenS = new Map<string, string>();
    const seenW = new Map<string, string>();
    for (const r of results) {
      for (const f of r.flags) {
        const bag = f.kind === "strength" ? seenS : seenW;
        if (!bag.has(f.label)) bag.set(f.label, f.detail);
      }
    }

    const weaknesses = [...seenW.values()];
    const recommendations =
      weaknesses.length === 0
        ? inBand.length > 0
          ? ["You clear this tier — proceed to university matching and shortlist programs here."]
          : []
        : [...new Set([...seenW.keys()].map(recommendationFor))];

    return {
      tier,
      label: meta.label,
      score: avg,
      programCount: inBand.length,
      strengths: [...seenS.values()],
      weaknesses,
      recommendations,
    };
  });
}
