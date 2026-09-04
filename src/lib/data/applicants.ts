import { db } from "@/lib/db";
import type { ApplicantRecord } from "@/lib/engines/similar";

/** All anonymized past applicants with their outcomes (Similar Student Finder). */
export async function getAnonymizedApplicants(): Promise<ApplicantRecord[]> {
  const rows = await db.anonymizedApplicant.findMany({
    include: { outcomes: true },
  });
  return rows.map((a) => ({
    id: a.id,
    cgpa: a.cgpa,
    ielts: a.ielts,
    researchPapers: a.researchPapers,
    targetField: a.targetField,
    nationality: a.nationality,
    outcomes: a.outcomes.map((o) => ({
      university: o.university,
      admitted: o.admitted,
      scholarship: o.scholarship,
    })),
  }));
}
