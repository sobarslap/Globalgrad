import { ImageResponse } from "next/og";

// A generated PNG app icon (App Router → /icon). Complements favicon.ico with a
// crisp mark for PWA install surfaces and high-DPI tabs. No external asset.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fafafa",
          fontSize: 300,
          fontWeight: 700,
          letterSpacing: -10,
          borderRadius: 96,
        }}
      >
        G
      </div>
    ),
    { ...size },
  );
}
