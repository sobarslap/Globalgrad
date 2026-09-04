import { db } from "@/lib/db";
import type { InsightSourceType } from "@prisma/client";

export interface InsightSourceView {
  id: string;
  title: string;
  url: string;
  sourceType: InsightSourceType;
  topic: string;
  snippet: string;
}

/** Distinct countries that have published insight sources. */
export async function getInsightCountries(): Promise<string[]> {
  const rows = await db.insightSource.findMany({
    where: { published: true, country: { not: null } },
    distinct: ["country"],
    select: { country: true },
    orderBy: { country: "asc" },
  });
  return rows.map((r) => r.country!).filter(Boolean);
}

/** Published sources for a country (plus general, country-less sources). */
export async function getInsightSources(
  country: string
): Promise<InsightSourceView[]> {
  const rows = await db.insightSource.findMany({
    where: {
      published: true,
      OR: [{ country }, { country: null }],
    },
    orderBy: { sourceType: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    url: r.url,
    sourceType: r.sourceType,
    topic: r.topic,
    snippet: r.snippet,
  }));
}
