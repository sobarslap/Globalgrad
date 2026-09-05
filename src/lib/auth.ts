import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";
import { authConfig } from "@/lib/auth.config";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { verifyTotp } from "@/lib/totp";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  token: z.string().optional(), // TOTP code, required only when 2FA is enabled
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  callbacks: {
    ...authConfig.callbacks,
    // Node-side JWT: on sign-in stamp id/role; on later requests re-read the
    // current role from the DB so role changes (and deletions) take effect. This
    // ran on EVERY request — one DB round-trip per navigation — so it is now
    // throttled to at most once per ROLE_SYNC_MS. Role/deletion changes still
    // propagate within that window (well under the 24h session), but most page
    // clicks skip the DB entirely, which is the main navigation-latency win.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        if ("role" in user && user.role) token.role = user.role;
        token.roleSyncedAt = Date.now();
        return token;
      }
      const ROLE_SYNC_MS = 60_000;
      const lastSync = (token.roleSyncedAt as number | undefined) ?? 0;
      if (token.id && Date.now() - lastSync >= ROLE_SYNC_MS) {
        try {
          const current = await db.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          });
          if (current) {
            token.role = current.role;
            token.roleSyncedAt = Date.now();
          } else {
            // Query succeeded but the account is gone — drop identifying claims.
            token.id = undefined;
            token.role = undefined;
          }
        } catch {
          // Transient DB error: keep the existing claims rather than logging the
          // user out. Role changes will be picked up on the next successful read.
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
        const { email, password, token } = parsed.data;

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

        // Second factor: when enabled, a valid TOTP code is mandatory. A
        // sentinel error lets the sign-in form prompt for the code.
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          if (!token) throw new Error("2FA_REQUIRED");
          if (!verifyTotp(user.twoFactorSecret, token)) return null;
        }

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
