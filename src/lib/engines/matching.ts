import type {
  MatchingResult,
  Program,
  ProgramMatch,
  StudentProfile,
} from "@/lib/domain/types";
import { scoreReadiness } from "@/lib/engines/readiness";

/**
 * Run the readiness engine across a set of programs and group the results into
 * Safe / Target / Reach buckets. Within each bucket, programs are sorted by
 * readiness score descending so the best fits surface first.
 */
export function matchPrograms(
  profile: StudentProfile,
  programs: Program[]
): MatchingResult {
  const all: ProgramMatch[] = programs.map((program) => ({
    program,
    ...scoreReadiness(profile, program),
  }));

  const byScoreDesc = (a: ProgramMatch, b: ProgramMatch) => b.score - a.score;

  const result: MatchingResult = {
    safe: all.filter((m) => m.bucket === "safe").sort(byScoreDesc),
    target: all.filter((m) => m.bucket === "target").sort(byScoreDesc),
    reach: all.filter((m) => m.bucket === "reach").sort(byScoreDesc),
    all: [...all].sort(byScoreDesc),
  };
  return result;
}

/**
 * Application Strategy Builder (Module 2, Feature 1): from a matching result,
 * suggest a balanced shortlist. Defaults to a 3 Safe / 4 Target / 2 Reach mix,
 * degrading gracefully when a bucket has fewer options.
 */
export interface StrategyPlan {
  safe: ProgramMatch[];
  target: ProgramMatch[];
  reach: ProgramMatch[];
  total: number;
  note: string;
}

export function buildStrategy(
  matching: MatchingResult,
  want: { safe?: number; target?: number; reach?: number } = {}
): StrategyPlan {
  const wantSafe = want.safe ?? 3;
  const wantTarget = want.target ?? 4;
  const wantReach = want.reach ?? 2;

  const safe = matching.safe.slice(0, wantSafe);
  const target = matching.target.slice(0, wantTarget);
  const reach = matching.reach.slice(0, wantReach);

  const shortfalls: string[] = [];
  if (safe.length < wantSafe)
    shortfalls.push(`only ${safe.length} safe option(s)`);
  if (target.length < wantTarget)
    shortfalls.push(`only ${target.length} target option(s)`);
  if (reach.length < wantReach)
    shortfalls.push(`only ${reach.length} reach option(s)`);

  const note =
    shortfalls.length === 0
      ? "Balanced plan: apply broadly across safe, target and reach schools to manage risk."
      : `Balanced plan adjusted — ${shortfalls.join(
          ", "
        )}. Consider widening your search or improving your profile.`;

  return {
    safe,
    target,
    reach,
    total: safe.length + target.length + reach.length,
    note,
  };
}
