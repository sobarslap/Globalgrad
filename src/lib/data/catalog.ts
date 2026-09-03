import { db } from "@/lib/db";
import type {
  Program,
  Scholarship,
  DegreeLevel,
} from "@/lib/domain/types";

const toLevel = (l: "BACHELORS" | "MASTERS" | "PHD"): DegreeLevel =>
  l === "BACHELORS" ? "bachelors" : l === "PHD" ? "phd" : "masters";

/** Published programs mapped to the engine's Program shape. */
export async function getPublishedPrograms(): Promise<Program[]> {
  const rows = await db.program.findMany({
    where: { published: true },
    include: { university: { select: { name: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    university: r.university.name,
    programName: r.programName,
    field: r.field,
    level: toLevel(r.level),
    selectivity: r.selectivity,
    minCgpa: r.minCgpa,
    minIelts: r.minIelts,
    admitCgpa: r.admitCgpa,
    admitIelts: r.admitIelts,
    valuesResearch: r.valuesResearch,
  }));
}

/** Published scholarships mapped to the engine's Scholarship shape. */
export async function getPublishedScholarships(): Promise<Scholarship[]> {
  const rows = await db.scholarship.findMany({ where: { published: true } });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    provider: r.provider,
    eligibleNationalities: r.eligibleNationalities,
    eligibleFields: r.eligibleFields,
    eligibleLevels: r.eligibleLevels.map(toLevel),
    minCgpa: r.minCgpa,
    minIelts: r.minIelts,
    meritCgpa: r.meritCgpa,
    valuesResearch: r.valuesResearch,
  }));
}
