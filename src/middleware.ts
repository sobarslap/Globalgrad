import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge middleware: uses only the edge-safe config (JWT check + authorized callback).
export default NextAuth(authConfig).auth;

export const config = {
  // Protect app areas; skip static assets, api/auth, and the Next internals.
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/content/:path*",
  ],
};
