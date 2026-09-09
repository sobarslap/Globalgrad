import { NextResponse } from "next/server";
import { streamGemini } from "@/lib/ai";
import { ADVISOR_SYSTEM, buildAdvisorContext } from "@/lib/advisor-context";
import { normalizeMode } from "@/lib/advisor-modes";

// Prisma + auth need the Node.js runtime (not edge). Never cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Streaming AI advisor (C7). POST { question } → a text/plain stream of answer
 * chunks. Auth, rate limiting, profile grounding and guardrails are shared with
 * the non-streaming `askAdvisor` action via `buildAdvisorContext`.
 */
export async function POST(req: Request) {
  let question = "";
  let mode: unknown = "general";
  try {
    const body = (await req.json()) as { question?: unknown; mode?: unknown };
    question = typeof body.question === "string" ? body.question : "";
    mode = body.mode;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ctx = await buildAdvisorContext(question, normalizeMode(mode));
  if (!ctx.ok) {
    return NextResponse.json({ error: ctx.error }, { status: ctx.status });
  }

  const encoder = new TextEncoder();
  const hasKey = !!process.env.GEMINI_API_KEY;
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // No AI key → stream the deterministic, engine-grounded fallback so the
      // advisor always responds.
      if (!hasKey) {
        controller.enqueue(encoder.encode(ctx.fallback));
        controller.close();
        return;
      }
      try {
        let produced = false;
        for await (const chunk of streamGemini(ADVISOR_SYSTEM, ctx.context)) {
          produced = true;
          controller.enqueue(encoder.encode(chunk));
        }
        if (!produced) {
          controller.enqueue(encoder.encode(ctx.fallback));
        }
      } catch {
        // Model unavailable (rate limit, transport) → grounded fallback, not an error.
        controller.enqueue(encoder.encode(ctx.fallback));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
