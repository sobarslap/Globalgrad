import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe auth config shared by middleware and the full node config.
 * Contains NO argon2/Prisma imports so it can run in the middleware (edge) bundle.
 * The Credentials provider (which needs argon2 + Prisma) is added only in auth.ts.
 */
const googleEnabled =
  !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET;

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  providers: googleEnabled ? [Google] : [],
  callbacks: {
    // Route protection used by middleware. Return false → redirect to signIn.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/admin")) return role === "ADMIN";
      if (pathname.startsWith("/content"))
        return role === "CONTENT_MANAGER" || role === "ADMIN";
      if (pathname.startsWith("/dashboard")) return isLoggedIn;
      return true;
    },
    // Persist id + role into the JWT on sign-in.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // role is attached by the Credentials authorize / signIn callbacks
        if ("role" in user && user.role) token.role = user.role;
      }
      return token;
    },
    // Expose id + role on the session.
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as
          | "STUDENT"
          | "CONTENT_MANAGER"
          | "ADMIN";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
