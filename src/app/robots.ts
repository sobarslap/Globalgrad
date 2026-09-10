import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt (App Router file convention → served at /robots.txt).
 *
 * We deliberately DO NOT block AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
 * Google-Extended…): being answerable by assistants is a discovery channel for
 * a study-abroad tool. We only disallow the authenticated, personalized app
 * surface and API — none of it is useful in a search index.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/api/",
    "/dashboard",
    "/applications",
    "/settings",
    "/admin",
    "/content",
    "/feed",
    "/advisor",
    "/similar",
    "/compare",
    "/search",
    "/calendar",
    "/map",
    "/reset-password",
    "/verify-email",
    "/forgot-password",
  ];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
