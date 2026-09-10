import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Default social-share image (App Router → /opengraph-image). Used by Metadata
// openGraph/twitter when a page doesn't supply its own. Server-generated, so no
// missing-og:image tell and no external asset to host.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE.title;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a0a0a 0%, #171326 60%, #1e1b4b 100%)",
          padding: 80,
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#7c3aed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            G
          </div>
          <div style={{ fontSize: 34, fontWeight: 600 }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 940 }}>
            Study abroad decisions, grounded in real data.
          </div>
          <div style={{ fontSize: 30, color: "#c4b5fd", maxWidth: 900 }}>
            Readiness scoring · university matching · scholarships · funding · visa prep · AI advisor
          </div>
        </div>
        <div style={{ fontSize: 26, color: "#a1a1aa" }}>{SITE.url.replace("https://", "")}</div>
      </div>
    ),
    { ...size },
  );
}
