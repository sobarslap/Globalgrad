import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Web app manifest (App Router file convention → /manifest.webmanifest).
 * Gives the site an installable identity, theme color, and icons instead of
 * the browser default — one of the small tells of an unfinished site.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
  };
}
