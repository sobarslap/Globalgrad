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
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
        });
        // Constant-ish response: never reveal whether the email exists.
        if (!user?.passwordHash) return null;

        const ok = await verifyPassword(user.passwordHash, password);
        if (!ok) return null;

        // Block sign-in until the email is verified (prevents using an
        // account registered with someone else's address).
        if (!user.emailVerified) return null;

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
