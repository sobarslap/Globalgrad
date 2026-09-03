"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
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

export type AuthActionState = { error?: string; ok?: boolean };

export async function signUp(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const ip = clientIp(await headers());
  const rl = rateLimit(`signup:${ip}`, 5, 15 * 60 * 1000);
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
  await db.user.create({
    data: { name, email, passwordHash, role: "STUDENT" },
  });

  // Sign the new user in; signIn throws a redirect on success.
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  return { ok: true };
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function signInWithCredentials(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const ip = clientIp(await headers());
  const rl = rateLimit(`login:${ip}`, 5, 60 * 1000); // 5/min/IP
  if (!rl.ok)
    return { error: `Too many attempts. Try again in ${rl.retryAfterSec}s.` };

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
    return { ok: true };
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw err; // re-throw redirects and unexpected errors
  }
}
