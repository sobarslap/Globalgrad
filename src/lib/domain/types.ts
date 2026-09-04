/**
 * Core domain types shared by the rule-based decision engines.
 * These are framework-agnostic and intentionally free of any DB/ORM coupling
 * so the engines stay pure and unit-testable.
 */

export type DegreeLevel = "bachelors" | "masters" | "phd";

/** A student's academic profile — the single source of truth for every engine. */
export interface StudentProfile {
  /** Cumulative GPA on a 4.0 scale. */
  cgpa: number;
  /** Overall IELTS band (0–9). Use the TOEFL-converted band if needed. */
  ielts: number;
  /** Number of research papers / publications. */
  researchPapers: number;
  /** Relevant work/internship experience in months. */
  workExperienceMonths: number;
  /** Level the student is applying for. */
  targetLevel: DegreeLevel;
  /** Field of study, e.g. "Computer Science". Free text, matched case-insensitively. */
  targetField: string;
  /** ISO-ish nationality label, e.g. "Bangladesh". */
  nationality: string;
  /** Optional GRE total (260–340) — only relevant for some programs. */
  greTotal?: number;
}

/** Macro-level country data for the Country Decision Dashboard (Module 1, F4). */
export interface CountryInfo {
  id: string;
  name: string;
  code: string;
  flagEmoji: string | null;
  postStudyWorkMonths: number | null;
  monthlyLivingCostUsd: number | null;
  costOfLivingIndex: number | null;
  partTimeAllowed: boolean;
  workHoursPerWeek: number | null;
  currency: string | null;
}

/** Admission profile of a specific university program. */
export interface Program {
  id: string;
  university: string;
  programName: string;
  field: string;
  level: DegreeLevel;
  /** 0–100, higher = harder to get into. Drives Safe/Target/Reach thresholds. */
  selectivity: number;
  /** Hard minimums; falling below these is a red flag, not an auto-reject. */
  minCgpa: number;
  minIelts: number;
  /** Typical admitted-student averages (for realistic comparison). */
  admitCgpa: number;
  admitIelts: number;
  /** Whether the program weighs research heavily (e.g. PhD / research MSc). */
  valuesResearch: boolean;
}

export type MatchBucket = "safe" | "target" | "reach";

export interface ReadinessFlag {
  kind: "strength" | "weakness";
  label: string;
  detail: string;
}

export interface ReadinessResult {
  /** 0–100 readiness for this specific program. */
  score: number;
  bucket: MatchBucket;
  flags: ReadinessFlag[];
  /** True when the student meets the program's hard minimums. */
  meetsMinimums: boolean;
}

export interface ProgramMatch extends ReadinessResult {
  program: Program;
}

export interface MatchingResult {
  safe: ProgramMatch[];
  target: ProgramMatch[];
  reach: ProgramMatch[];
  all: ProgramMatch[];
}

/** A scholarship's eligibility + merit criteria. */
export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  /** Nationalities allowed; empty array = open to all. */
  eligibleNationalities: string[];
  /** Fields the scholarship covers; empty = any field. */
  eligibleFields: string[];
  /** Levels the scholarship covers; empty = any level. */
  eligibleLevels: DegreeLevel[];
  /** Minimum GPA to be considered. */
  minCgpa: number;
  /** Minimum IELTS to be considered. */
  minIelts: number;
  /** GPA at/above which the applicant is a strong merit candidate. */
  meritCgpa: number;
  /** Whether research strengthens the application. */
  valuesResearch: boolean;
  /** Award amount in USD, if known. */
  amountUsd?: number;
}

export interface ScholarshipMatch {
  scholarship: Scholarship;
  /** 0–100 funding-match percentage. 0 when a hard eligibility gate fails. */
  matchPercent: number;
  eligible: boolean;
  reasons: string[];
}
