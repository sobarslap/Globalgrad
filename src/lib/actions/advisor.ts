"use server";

import { callGemini } from "@/lib/ai";
import { ADVISOR_SYSTEM, buildAdvisorContext } from "@/lib/advisor-context";

export type AdvisorResult = { ok: boolean; text?: string; error?: string };

/**
 * Non-streaming advisor call. Kept as the client's graceful fallback when the
 * streaming route (`/api/advisor/stream`) is unavailable; both share
 * `buildAdvisorContext` so the grounding and guardrails are identical.
 */
export async function askAdvisor(question: string): Promise<AdvisorResult> {
  const ctx = await buildAdvisorContext(question);
  if (!ctx.ok) return { ok: false, error: ctx.error };
  return callGemini(ADVISOR_SYSTEM, ctx.context);
}
