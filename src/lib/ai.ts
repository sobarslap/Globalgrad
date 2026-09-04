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
