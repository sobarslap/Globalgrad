"use server";

import { callGemini } from "@/lib/ai";
import { ADVISOR_SYSTEM, buildAdvisorContext } from "@/lib/advisor-context";
import { normalizeMode, type AdvisorMode } from "@/lib/advisor-modes";

export type AdvisorResult = { ok: boolean; text?: string; error?: string; grounded?: boolean };

/**
 * Non-streaming advisor call. Kept as the client's graceful fallback when the
 * streaming route (`/api/advisor/stream`) is unavailable; both share
 * `buildAdvisorContext` so the grounding and guardrails are identical.
 *
 * When no AI key is configured, or the model call fails, we return the
 * deterministic engine-only `fallback` answer (marked `grounded`) so the
 * advisor always responds — the live demo never dead-ends.
 */
export async function askAdvisor(
  question: string,
  mode: AdvisorMode = "general"
): Promise<AdvisorResult> {
  const ctx = await buildAdvisorContext(question, normalizeMode(mode));
  if (!ctx.ok) return { ok: false, error: ctx.error };

  if (!process.env.GEMINI_API_KEY) {
    return { ok: true, text: ctx.fallback, grounded: true };
  }

  const res = await callGemini(ADVISOR_SYSTEM, ctx.context);
  if (res.ok && res.text) return { ok: true, text: res.text };
  return { ok: true, text: ctx.fallback, grounded: true };
}
