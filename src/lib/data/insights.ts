import { Prisma } from "@prisma/client";
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

/** Format a JS number[] as a pgvector literal, e.g. "[0.1,0.2,…]". */
export function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}

/** Persist an embedding onto an insight source (A1). Vector column is raw SQL. */
export async function storeInsightEmbedding(
  id: string,
  values: number[]
): Promise<void> {
  const lit = toVectorLiteral(values);
  await db.$executeRaw`
    UPDATE "InsightSource" SET "embedding" = ${lit}::vector WHERE "id" = ${id}`;
}

/**
 * Semantic retrieval (A1): the published sources most similar to a query
 * embedding, by pgvector cosine distance, scoped to a country (+ general,
 * country-less sources). Only rows that have an embedding participate.
 */
export async function searchInsightsBySimilarity(
  queryEmbedding: number[],
  country: string,
  limit = 8
): Promise<InsightSourceView[]> {
  const lit = toVectorLiteral(queryEmbedding);
  const rows = await db.$queryRaw<
    Array<{
      id: string;
      title: string;
      url: string;
      sourceType: InsightSourceType;
      topic: string;
      snippet: string;
    }>
  >(Prisma.sql`
    SELECT "id", "title", "url", "sourceType", "topic", "snippet"
    FROM "InsightSource"
    WHERE "published" = true
      AND "embedding" IS NOT NULL
      AND ("country" = ${country} OR "country" IS NULL)
    ORDER BY "embedding" <=> ${lit}::vector
    LIMIT ${limit}`);
  return rows;
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
