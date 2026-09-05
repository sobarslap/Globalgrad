/**
 * Minimal Gemini client (REST). Server-only — the API key never reaches the
 * client. Used by the AI advisor to *explain* rule-based results, never to
 * replace them.
 */
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

export interface GeminiResult {
  ok: boolean;
  text?: string;
  error?: string;
}

export async function callGemini(
  systemInstruction: string,
  userPrompt: string
): Promise<GeminiResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { ok: false, error: "AI is not configured." };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 900 },
  });

  // Try API-key header first; if unauthorized, retry treating the key as an
  // OAuth bearer token (the AQ.* format can be an OAuth access token).
  const attempts: Record<string, string>[] = [
    { "Content-Type": "application/json", "x-goog-api-key": key },
    { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
  ];

  try {
    let res: Response | null = null;
    for (const headers of attempts) {
      res = await fetch(url, {
        method: "POST",
        headers,
        body: payload,
        cache: "no-store",
      });
      if (res.ok) break;
      if (res.status !== 401 && res.status !== 403) break;
    }
    if (!res) return { ok: false, error: "The advisor is unavailable." };

    if (!res.ok) {
      const status = res.status;
      const body = await res.text().catch(() => "");
      console.error(
        `[gemini] status=${status} model=${MODEL} body=${body.slice(0, 400)}`
      );
      return {
        ok: false,
        error:
          status === 429
            ? "The advisor is busy (rate limit). Try again shortly."
            : "The advisor is temporarily unavailable.",
      };
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) return { ok: false, error: "No answer was generated." };
    return { ok: true, text };
  } catch {
    return { ok: false, error: "Could not reach the advisor service." };
  }
}

/**
 * Streaming variant (C7): yields answer text chunks as Gemini produces them via
 * the SSE `streamGenerateContent` endpoint. Reuses the same dual-auth strategy
 * (API-key header, then Bearer). Throws on an unrecoverable transport/auth error
 * so the caller can surface a friendly message; yields nothing on an empty body.
 */
export async function* streamGemini(
  systemInstruction: string,
  userPrompt: string
): AsyncGenerator<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("AI is not configured.");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 900 },
  });

  const attempts: Record<string, string>[] = [
    { "Content-Type": "application/json", "x-goog-api-key": key },
    { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
  ];

  let res: Response | null = null;
  for (const headers of attempts) {
    res = await fetch(url, { method: "POST", headers, body: payload });
    if (res.ok) break;
    if (res.status !== 401 && res.status !== 403) break;
  }
  if (!res || !res.ok || !res.body) {
    const status = res?.status;
    if (status && res) {
      const body = await res.text().catch(() => "");
      console.error(`[gemini stream] status=${status} body=${body.slice(0, 400)}`);
    }
    throw new Error("The advisor is temporarily unavailable.");
  }

  // Parse the SSE stream: lines of `data: {json}`; each JSON is a partial
  // GenerateContentResponse whose candidate part carries the next text chunk.
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (!json || json === "[DONE]") continue;
      try {
        const data = JSON.parse(json) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const chunk = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunk) yield chunk;
      } catch {
        // Ignore keep-alive / partial-JSON lines.
      }
    }
  }
}
