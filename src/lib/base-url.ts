import { headers } from "next/headers";

/**
 * Trusted base URL for links in emails. Never derived from the request Host
 * header in production (that enables reset/verification-link poisoning).
 * Order: explicit AUTH_URL → Vercel production domain → localhost (dev only).
 */
export async function baseUrl(): Promise<string> {
  if (process.env.AUTH_URL) return process.env.AUTH_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  if (process.env.NODE_ENV !== "production") {
    const h = await headers();
    return `http://${h.get("host") ?? "localhost:3000"}`;
  }
  return "https://globalgrad-wheat.vercel.app";
}
