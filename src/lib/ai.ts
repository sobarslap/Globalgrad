/**
 * Minimal Gemini client (REST). Server-only — the API key never reaches the
 * client. Used by the AI advisor to *explain* rule-based results, never to
 * replace them.
 */
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

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

  // Send the key in the x-goog-api-key header (works for both classic AIza keys
  // and the newer AQ.* key format; the ?key= query param rejects the new format).
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 900 },
      }),
      // Advisor answers should be fresh, not cached.
      cache: "no-store",
    });

    if (!res.ok) {
      // Never surface the key or raw provider internals to the client.
      const status = res.status;
      // Server-side diagnostic only (no key in the URL/body logged).
      const body = await res.text().catch(() => "");
      console.error(
        `[gemini] status=${status} model=${MODEL} body=${body.slice(0, 500)}`
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
