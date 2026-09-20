import { createHash } from "node:crypto";

/** Stable content hash for change-detection between crawls. */
export function contentHash(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? " ");
}

/**
 * Lightweight, dependency-free HTML → text extractor. Prefers <main>/<article>
 * content, strips scripts/styles/markup, and collapses whitespace. Good enough
 * for the mostly-static official pages on the crawl whitelist; a Content Manager
 * reviews every crawled result before it is published.
 */
export function extractText(html: string): { title: string; text: string } {
  const title = decodeEntities(
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? ""
  );
  const region =
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ??
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1] ??
    html;
  const text = decodeEntities(
    region
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
  return { title, text };
}

export type FetchResult =
  | { ok: true; title: string; text: string }
  | { ok: false; error: string };

/**
 * SSRF guard: only allow http(s) to a public host. Blocks localhost, private /
 * link-local ranges, and the cloud metadata address (169.254.169.254) so a
 * crawl source can never be pointed at internal infrastructure. This is a
 * best-effort literal-host check (it does not resolve DNS), layered on top of
 * the fact that crawl sources are curated, not user-submitted.
 */
export function isFetchableUrl(raw: string): boolean {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;

  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return false;
  }
  // IPv6 loopback / unspecified / unique-local / link-local.
  if (host === "::1" || host === "::" || /^f[cd]/.test(host) || host.startsWith("fe80:")) {
    return false;
  }
  // IPv4 private, loopback, link-local (incl. 169.254.169.254 metadata) ranges.
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Fetch a whitelisted URL politely (identifying User-Agent, 10s timeout) and
 * extract its readable text. Never throws — returns a typed error instead.
 */
export async function fetchAndExtract(url: string): Promise<FetchResult> {
  if (!isFetchableUrl(url)) return { ok: false, error: "blocked URL" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "GlobalGradBot/1.0 (+https://globalgrad-wheat.vercel.app; study-abroad research)",
        Accept: "text/html",
      },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html")) return { ok: false, error: `non-HTML (${ct})` };
    const html = await res.text();
    const { title, text } = extractText(html);
    if (text.length < 200) return { ok: false, error: "too little text" };
    return { ok: true, title, text };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "fetch failed" };
  } finally {
    clearTimeout(timer);
  }
}
