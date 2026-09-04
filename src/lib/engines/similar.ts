import type { StudentProfile } from "@/lib/domain/types";

export interface ApplicantOutcomeRecord {
  university: string;
  admitted: boolean;
  scholarship: boolean;
}

export interface ApplicantRecord {
  id: string;
  cgpa: number;
  ielts: number;
  researchPapers: number;
  targetField: string;
  nationality: string;
  outcomes: ApplicantOutcomeRecord[];
}

export interface SimilarApplicant {
  applicant: ApplicantRecord;
  similarity: number; // 0–100
}

export interface UniversityStat {
  university: string;
  applications: number;
  admits: number;
  admitRate: number; // 0–100
}

export interface SimilarResult {
  matches: SimilarApplicant[];
  count: number;
  admitRate: number; // across matched applicants' outcomes
  scholarshipRate: number;
  topUniversities: UniversityStat[];
}

const eqCI = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Find previous applicants most similar to the student (weighted distance on
 * CGPA, IELTS, research + same-field bonus), and summarize where they applied,
 * how often they were admitted, and how often they were funded.
 */
export function findSimilar(
  profile: StudentProfile,
  applicants: ApplicantRecord[],
  n = 6
): SimilarResult {
  const scored: SimilarApplicant[] = applicants.map((a) => {
    const dCgpa = (a.cgpa - profile.cgpa) / 4;
    const dIelts = (a.ielts - profile.ielts) / 9;
    const dRes = (a.researchPapers - profile.researchPapers) / 5;
    let dist = Math.sqrt(
      2 * dCgpa * dCgpa + 1.5 * dIelts * dIelts + 1 * dRes * dRes
    );
    if (!eqCI(a.targetField, profile.targetField)) dist += 0.25; // field penalty
    const similarity = Math.round(100 * Math.max(0, 1 - Math.min(1, dist)));
    return { applicant: a, similarity };
  });

  const matches = scored
    .sort((x, y) => y.similarity - x.similarity)
    .slice(0, n);

  // Aggregate outcomes across the matched applicants.
  const outcomes = matches.flatMap((m) => m.applicant.outcomes);
  const total = outcomes.length;
  const admits = outcomes.filter((o) => o.admitted).length;
  const scholarships = outcomes.filter((o) => o.scholarship).length;

  const byUni = new Map<string, { applications: number; admits: number }>();
  for (const o of outcomes) {
    const cur = byUni.get(o.university) ?? { applications: 0, admits: 0 };
    cur.applications += 1;
    if (o.admitted) cur.admits += 1;
    byUni.set(o.university, cur);
  }
  const topUniversities: UniversityStat[] = [...byUni.entries()]
    .map(([university, s]) => ({
      university,
      applications: s.applications,
      admits: s.admits,
      admitRate: s.applications
        ? Math.round((s.admits / s.applications) * 100)
        : 0,
    }))
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 6);

  return {
    matches,
    count: matches.length,
    admitRate: total ? Math.round((admits / total) * 100) : 0,
    scholarshipRate: total ? Math.round((scholarships / total) * 100) : 0,
    topUniversities,
  };
}
