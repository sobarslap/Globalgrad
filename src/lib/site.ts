/**
 * Single source of truth for site-wide identity used by metadata, structured
 * data, robots, sitemap, and the footer. Keeping this here (rather than
 * scattering literals) means one edit updates canonical URLs, OG tags, and
 * JSON-LD together.
 *
 * `SITE_URL` mirrors the resolution order in `src/lib/base-url.ts` but is
 * synchronous, because Next's `metadata` / `sitemap` / `robots` exports and
 * `metadataBase` all run outside a request and cannot `await headers()`.
 */
export const SITE_URL = (
  process.env.AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://globalgrad-wheat.vercel.app")
).replace(/\/$/, "");

export const SITE = {
  name: "GlobalGrad",
  /** Used in <title> templates and OG site_name. */
  title: "GlobalGrad — Study Abroad & Scholarship Decision Support",
  tagline: "Study abroad decisions, grounded in data.",
  description:
    "Personalized study-abroad decisions: readiness scoring, smart university matching, scholarship eligibility, funding analysis, visa prep, and an AI advisor grounded in real data.",
  url: SITE_URL,
  /** Reachable inbox shown publicly (contact, legal pages, footer). */
  email: "zubairul.mahi@gmail.com",
  locale: "en_US",
  social: {
    github: "https://github.com/sobarslap/Globalgrad",
    linkedin: "https://www.linkedin.com/in/zubairul-islam",
  },
} as const;

/**
 * Public, crawlable routes (no auth required to render meaningfully). Used to
 * generate the sitemap and to decide which pages carry indexable metadata.
 * The authenticated app surface (dashboard, applications, settings, admin…) is
 * intentionally excluded — it's gated and personalized, not for the index.
 */
export const PUBLIC_ROUTES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/countries", priority: 0.8, changeFrequency: "weekly" },
  { path: "/visa", priority: 0.8, changeFrequency: "weekly" },
  { path: "/cost", priority: 0.7, changeFrequency: "monthly" },
  { path: "/insights", priority: 0.7, changeFrequency: "daily" },
  { path: "/reality", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "monthly" },
  { path: "/sign-in", priority: 0.4, changeFrequency: "monthly" },
  { path: "/sign-up", priority: 0.5, changeFrequency: "monthly" },
];
