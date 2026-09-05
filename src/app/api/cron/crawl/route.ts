import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { embedText } from "@/lib/ai";
import { fetchAndExtract, contentHash } from "@/lib/crawler";
import { storeInsightEmbedding } from "@/lib/data/insights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Public Insight crawler (A1 phase 2). Fetches a bounded batch of enabled,
 * whitelisted CrawlSources, extracts readable text, and — when the content has
 * changed — writes an UNPUBLISHED (CRAWLED) InsightSource for a Content Manager
 * to review, embedding it for semantic retrieval. Secured by CRON_SECRET; runs
 * on Vercel Cron. Every source is handled independently so one failure can't
 * abort the run.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Oldest-first so every source is revisited fairly; small batch per run.
  const sources = await db.crawlSource.findMany({
    where: { enabled: true },
    orderBy: { lastCrawledAt: { sort: "asc", nulls: "first" } },
    take: 5,
  });

  const results: Array<{ url: string; status: string }> = [];

  for (const src of sources) {
    const fetched = await fetchAndExtract(src.url);
    if (!fetched.ok) {
      await db.crawlSource.update({
        where: { id: src.id },
        data: { lastCrawledAt: new Date(), lastStatus: `error: ${fetched.error}` },
      });
      results.push({ url: src.url, status: `error: ${fetched.error}` });
      continue;
    }

    const snippet = fetched.text.slice(0, 1500);
    const hash = contentHash(snippet);
    if (hash === src.lastHash) {
      await db.crawlSource.update({
        where: { id: src.id },
        data: { lastCrawledAt: new Date(), lastStatus: "unchanged" },
      });
      results.push({ url: src.url, status: "unchanged" });
      continue;
    }

    // Upsert the crawled source (unpublished, pending CM review).
    const existing = await db.insightSource.findFirst({
      where: { url: src.url, origin: "CRAWLED" },
      select: { id: true },
    });
    const data = {
      title: src.title || fetched.title || src.url,
      url: src.url,
      sourceType: src.sourceType,
      country: src.country,
      topic: src.topic,
      snippet,
      origin: "CRAWLED" as const,
      published: false,
      fetchedAt: new Date(),
      contentHash: hash,
    };
    const saved = existing
      ? await db.insightSource.update({ where: { id: existing.id }, data })
      : await db.insightSource.create({ data });

    const vec = await embedText(`${data.title}\n\n${snippet}`);
    if (vec) await storeInsightEmbedding(saved.id, vec);

    await db.crawlSource.update({
      where: { id: src.id },
      data: { lastCrawledAt: new Date(), lastHash: hash, lastStatus: "ok" },
    });
    results.push({ url: src.url, status: vec ? "ok" : "ok (no embedding)" });
  }

  return NextResponse.json({ ok: true, crawled: results.length, results });
}
