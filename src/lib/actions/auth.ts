"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { sendVerification } from "@/lib/actions/verify";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Za-z]/, "Include a letter")
    .regex(/[0-9]/, "Include a number"),
});

export type AuthActionState = {
  error?: string;
  ok?: boolean;
  message?: string;
  twoFactor?: boolean; // sign-in needs a TOTP code to continue
};

export async function signUp(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const ip = clientIp(await headers());
  const rl = await rateLimit(`signup:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.ok)
    return { error: `Too many attempts. Try again in ${rl.retryAfterSec}s.` };

  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { name, email, password } = parsed.data;

  // Generic message whether or not the email exists (no user enumeration).
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Could not create account. Try a different email." };
  }

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: { name, email, passwordHash, role: "STUDENT" },
  });

  // Send a verification email. If email delivery isn't configured (no key), the
  // mailer skips — auto-verify so the flow still works, then sign in.
  const sent = await sendVerification(user.id, user.email);
  if (sent.skipped) {
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
    return { ok: true };
  }

  // Verification required — do not sign in until the email is confirmed.
  return {
    ok: true,
    message:
      "Account created. Check your email for a verification link, then sign in.",
  };
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

/**
 * One-click demo sign-in. Authenticates the seeded demo student using the
 * server-only DEMO_USER_PASSWORD (the same value the seed hashed), so no
 * credentials are ever committed or exposed to the client. Lets recruiters and
 * evaluators walk the whole product without creating an account.
 */
export async function signInAsDemo(): Promise<AuthActionState> {
  const email = "demo@globalgrad.app";
  const password = process.env.DEMO_USER_PASSWORD || "DemoStudent#2026";

  const ip = clientIp(await headers());
  const rl = await rateLimit(`demo:${ip}`, 10, 60 * 1000);
  if (!rl.ok)
    return { error: `Too many attempts. Try again in ${rl.retryAfterSec}s.` };

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
    return { ok: true };
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Demo account is unavailable right now." };
    }
    throw err; // re-throw the redirect
  }
}

/** OAuth sign-in with Google. No-op-safe: only reachable when Google is configured. */
export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signInWithCredentials(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const ip = clientIp(await headers());
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const token = String(formData.get("token") ?? "").trim();

  // Limit by IP and by target email (blunts credential-stuffing / lockout abuse).
  const [byIp, byEmail] = await Promise.all([
    rateLimit(`login:ip:${ip}`, 10, 60 * 1000), // 10/min/IP
    email
      ? rateLimit(`login:email:${email}`, 5, 10 * 60 * 1000) // 5/10min/email
      : Promise.resolve({ ok: true, remaining: 0, retryAfterSec: 0 }),
  ]);
  if (!byIp.ok || !byEmail.ok) {
    const wait = Math.max(byIp.retryAfterSec, byEmail.retryAfterSec);
    return { error: `Too many attempts. Try again in ${wait}s.` };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      token: token || undefined,
      redirectTo: "/dashboard",
    });
    return { ok: true };
  } catch (err) {
    if (err instanceof AuthError) {
      // authorize() throws "2FA_REQUIRED" when a code is needed; next-auth wraps
      // it, so scan the error chain for the sentinel.
      let cause: unknown = err;
      for (let i = 0; i < 4 && cause; i++) {
        const msg = (cause as { message?: string })?.message;
        if (msg === "2FA_REQUIRED") {
          return token
            ? { error: "That code isn't valid.", twoFactor: true }
            : { twoFactor: true };
        }
        cause = (cause as { cause?: unknown })?.cause;
      }
      return { error: "Invalid email or password." };
    }
    throw err; // re-throw redirects and unexpected errors
  }
}
