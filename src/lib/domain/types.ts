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
  /** Minimum GRE total (260–340) where required; undefined = not required. */
  minGre?: number;
  /** Typical admit GRE total, for realistic comparison. */
  admitGre?: number;
  /** Annual tuition in USD, if known — used by cards and the cost calculator. */
  tuitionUsd?: number;
  /** Display metadata for match cards. */
  country?: string;
  city?: string;
  intake?: string;
  applicationUrl?: string;
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
  /** How much of the cost it covers. */
  funding?: "FULLY_FUNDED" | "PARTIAL";
  coverage?: "FULL" | "MAJOR" | "PARTIAL";
  needBased?: boolean;
  meritBased?: boolean;
  renewable?: boolean;
  noAppFee?: boolean;
  livingAllowance?: boolean;
  /** Primary application deadline (ISO string or Date). */
  deadlineAt?: string | Date | null;
  applicationUrl?: string;
  /** Country display names this scholarship funds study in. */
  hostCountries?: string[];
}

/** Filter criteria for the scholarship wizard (Phase 5). */
export interface ScholarshipFilter {
  countries?: string[];
  fundingType?: "FULLY_FUNDED" | "PARTIAL" | "ALL";
  coverage?: "FULL" | "MAJOR" | "PARTIAL" | "ALL";
  need?: "NEED" | "MERIT" | "BOTH";
  /** Only scholarships with a deadline within this many days. */
  deadlineWithinDays?: 30 | 60 | 90 | null;
  renewable?: boolean;
  noAppFee?: boolean;
  livingAllowance?: boolean;
}

export interface ScholarshipMatch {
  scholarship: Scholarship;
  /** 0–100 funding-match percentage. 0 when a hard eligibility gate fails. */
  matchPercent: number;
  eligible: boolean;
  reasons: string[];
}
