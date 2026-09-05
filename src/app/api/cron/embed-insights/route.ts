import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { embedText } from "@/lib/ai";
import { storeInsightEmbedding } from "@/lib/data/insights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Backfill pgvector embeddings for insight sources that don't have one yet (A1).
 * Runs on Vercel (where Gemini is reachable) — triggered by Vercel Cron or
 * manually with the CRON_SECRET. Processes a bounded batch per run so it fits
 * inside the function time limit; call repeatedly until `remaining` is 0.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Rows without an embedding (raw SQL — Prisma can't filter the vector column).
  const pending = await db.$queryRaw<
    Array<{ id: string; title: string; snippet: string }>
  >`SELECT "id", "title", "snippet" FROM "InsightSource"
      WHERE "embedding" IS NULL LIMIT 25`;

  let embedded = 0;
  for (const row of pending) {
    const vec = await embedText(`${row.title}\n\n${row.snippet}`);
    if (vec) {
      await storeInsightEmbedding(row.id, vec);
      embedded++;
    }
  }

  const [{ remaining }] = await db.$queryRaw<Array<{ remaining: bigint }>>`
    SELECT COUNT(*)::bigint AS remaining FROM "InsightSource" WHERE "embedding" IS NULL`;

  return NextResponse.json({
    ok: true,
    batch: pending.length,
    embedded,
    remaining: Number(remaining),
  });
}
