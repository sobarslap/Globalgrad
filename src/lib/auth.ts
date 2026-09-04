import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";
import { authConfig } from "@/lib/auth.config";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  callbacks: {
    ...authConfig.callbacks,
    // Node-side JWT: on sign-in stamp id/role; on every later request re-read the
    // current role from the DB so role changes (and deletions) take effect at once.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        if ("role" in user && user.role) token.role = user.role;
        return token;
      }
      if (token.id) {
        const current = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (!current) {
          // Account no longer exists — drop identifying claims.
          token.id = undefined;
          token.role = undefined;
        } else {
          token.role = current.role;
        }
      }
      return token;
    },
  },
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) {
          console.error("[authz] parse-failed");
          return null;
        }
        const { email, password } = parsed.data;

        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
        });
        // Constant-ish response: never reveal whether the email exists.
        if (!user?.passwordHash) {
          console.error("[authz] no-user-or-hash");
          return null;
        }

        let ok = false;
        try {
          ok = await verifyPassword(user.passwordHash, password);
        } catch (e) {
          console.error("[authz] verify-threw", (e as Error).message);
          return null;
        }
        if (!ok) {
          console.error("[authz] bad-password");
          return null;
        }

        // Block sign-in until the email is verified (prevents using an
        // account registered with someone else's address).
        if (!user.emailVerified) {
          console.error("[authz] not-verified");
          return null;
        }
        console.error("[authz] success");

        // Only non-sensitive fields flow into the JWT. No passwordHash.
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
