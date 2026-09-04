"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { callGemini } from "@/lib/ai";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import {
  getInsightSources,
  type InsightSourceView,
} from "@/lib/data/insights";

const SYSTEM = `You are the GlobalGrad Public Insight Engine.
Synthesize practical study-abroad insight for a country from the PROVIDED SOURCES only.
Rules:
- Use ONLY the numbered sources given; do not add facts from outside them.
- Group into short sections: Common advice, Warnings, Student experiences.
- Cite sources inline as [n] matching the numbers provided. Every claim needs a citation.
- Be concise (bullets), neutral, and honest. If sources conflict or are thin, say so.`;

export interface InsightResult {
  ok: boolean;
  summary?: string; // may be null if AI unavailable
  sources: InsightSourceView[];
  error?: string;
}

/**
 * Gather curated, Content-Manager-published sources for a country and have the AI
 * synthesize common advice/warnings/experiences with inline [n] citations. Falls
 * back to returning the raw sources if the AI is unavailable.
 */
export async function summarizeInsights(
  country: string
): Promise<InsightResult> {
  const session = await auth();
  if (!session?.user?.id)
    return { ok: false, sources: [], error: "Not authenticated." };

  const rl = rateLimit(`insights:${session.user.id}`, 10, 60 * 1000);
  if (!rl.ok)
    return {
      ok: false,
      sources: [],
      error: `Slow down — try again in ${rl.retryAfterSec}s.`,
    };

  const sources = await getInsightSources(country);
  if (sources.length === 0)
    return { ok: false, sources: [], error: "No sources for this country yet." };

  const numbered = sources
    .map(
      (s, i) =>
        `[${i + 1}] (${s.sourceType}, ${s.topic}) ${s.title}: ${s.snippet}`
    )
    .join("\n");

  const prompt = `Country: ${country}\n\nSOURCES:\n${numbered}\n\nWrite the synthesis now.`;
  const ai = await callGemini(SYSTEM, prompt);

  // Graceful degradation: if AI fails, still return the sources for manual reading.
  return { ok: true, summary: ai.ok ? ai.text : undefined, sources };
}
