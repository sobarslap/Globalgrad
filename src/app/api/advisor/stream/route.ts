import { NextResponse } from "next/server";
import { streamGemini } from "@/lib/ai";
import { ADVISOR_SYSTEM, buildAdvisorContext } from "@/lib/advisor-context";

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
  try {
    const body = (await req.json()) as { question?: unknown };
    question = typeof body.question === "string" ? body.question : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ctx = await buildAdvisorContext(question);
  if (!ctx.ok) {
    return NextResponse.json({ error: ctx.error }, { status: ctx.status });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let produced = false;
        for await (const chunk of streamGemini(ADVISOR_SYSTEM, ctx.context)) {
          produced = true;
          controller.enqueue(encoder.encode(chunk));
        }
        if (!produced) {
          controller.enqueue(encoder.encode("No answer was generated."));
        }
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "The advisor is temporarily unavailable.";
        // Surface the error inline in the stream body (status is already 200).
        controller.enqueue(encoder.encode(`\n[error] ${msg}`));
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
