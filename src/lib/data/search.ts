import { db } from "@/lib/db";
import type { DegreeLevel } from "@prisma/client";

export interface ProgramHit {
  id: string;
  university: string;
  country: string | null;
  programName: string;
  field: string;
  level: DegreeLevel;
  selectivity: number;
  tuitionUsd: number | null;
}

export interface ScholarshipHit {
  id: string;
  name: string;
  provider: string;
  amountUsd: number | null;
}

export interface SearchResult {
  programs: ProgramHit[];
  scholarships: ScholarshipHit[];
}

export interface SearchFilters {
  q?: string;
  level?: DegreeLevel;
  country?: string;
}

/**
 * Keyword search over published programs and scholarships, with optional level
 * and country filters. Case-insensitive `contains` across the relevant fields.
 */
export async function searchCatalog(
  filters: SearchFilters
): Promise<SearchResult> {
  const q = filters.q?.trim();
  const ci = { contains: q ?? "", mode: "insensitive" as const };

  const [programs, scholarships] = await Promise.all([
    db.program.findMany({
      where: {
        published: true,
        ...(filters.level ? { level: filters.level } : {}),
        ...(filters.country
          ? { university: { country: { name: filters.country } } }
          : {}),
        ...(q
          ? {
              OR: [
                { programName: ci },
                { field: ci },
                { university: { name: ci } },
              ],
            }
          : {}),
      },
      include: {
        university: {
          select: { name: true, country: { select: { name: true } } },
        },
      },
      orderBy: { selectivity: "desc" },
      take: 30,
    }),
    // Scholarships aren't country-scoped here; skip them when a country filter is set.
    filters.country
      ? Promise.resolve([])
      : db.scholarship.findMany({
          where: {
            published: true,
            ...(filters.level ? { eligibleLevels: { has: filters.level } } : {}),
            ...(q
              ? { OR: [{ name: ci }, { provider: ci }] }
              : {}),
          },
          orderBy: { name: "asc" },
          take: 20,
        }),
  ]);

  return {
    programs: programs.map((p) => ({
      id: p.id,
      university: p.university.name,
      country: p.university.country?.name ?? null,
      programName: p.programName,
      field: p.field,
      level: p.level,
      selectivity: p.selectivity,
      tuitionUsd: p.tuitionUsd,
    })),
    scholarships: scholarships.map((s) => ({
      id: s.id,
      name: s.name,
      provider: s.provider,
      amountUsd: s.amountUsd ?? null,
    })),
  };
}
