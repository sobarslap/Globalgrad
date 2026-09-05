import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// NOTE: the Content-Security-Policy is now set per-request in `src/middleware.ts`
// (nonce-based, B1) — a static header can't carry a per-request nonce. These are
// the remaining static security headers, applied to every response.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // HSTS only in production (avoid pinning localhost over http in dev).
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
