"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { sendEmail, emailShell, type SendResult } from "@/lib/mailer";
import { baseUrl } from "@/lib/base-url";

const sha256 = (v: string) =>
  crypto.createHash("sha256").update(v).digest("hex");
const emailSchema = z.string().trim().toLowerCase().email();

export type VerifyState = { ok?: boolean; error?: string; message?: string };

/**
 * Generate + email a verification link for a user. Returns the mailer result so
 * callers can auto-verify when email delivery is not configured (no key = skipped).
 */
export async function sendVerification(
  userId: string,
  email: string
): Promise<SendResult> {
  const token = crypto.randomBytes(32).toString("hex");
  await db.emailVerificationToken.create({
    data: {
      userId,
      tokenHash: sha256(token),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    },
  });
  const link = `${await baseUrl()}/verify-email?token=${token}`;
  return sendEmail({
    to: email,
    subject: "Verify your GlobalGrad email",
    html: emailShell(
      "Confirm your email",
      `<p>Welcome to GlobalGrad! Confirm your email to activate your account (link valid 24 hours):</p>
       <p><a href="${link}" style="color:#7c3aed">Verify email</a></p>`
    ),
  });
}

/** Consume a verification token and mark the user's email verified. */
export async function verifyEmailToken(
  token: string
): Promise<{ ok: boolean; error?: string }> {
  if (!token) return { ok: false, error: "Missing verification token." };
  const record = await db.emailVerificationToken.findUnique({
    where: { tokenHash: sha256(token) },
  });
  if (!record || record.usedAt || record.expires < new Date()) {
    return { ok: false, error: "This link is invalid or has expired." };
  }
  await db.$transaction([
    db.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    db.emailVerificationToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    db.emailVerificationToken.deleteMany({
      where: { userId: record.userId, usedAt: null },
    }),
  ]);
  return { ok: true };
}

/** Resend a verification link. Generic response (no account enumeration). */
export async function resendVerification(
  _prev: VerifyState,
  formData: FormData
): Promise<VerifyState> {
  const ip = clientIp(await headers());
  const rl = await rateLimit(`verify:${ip}`, 3, 60 * 60 * 1000);
  if (!rl.ok)
    return { error: `Too many requests. Try again in ${rl.retryAfterSec}s.` };

  const generic: VerifyState = {
    ok: true,
    message: "If that account exists and is unverified, a new link is on its way.",
  };
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return generic;

  const user = await db.user.findUnique({ where: { email: parsed.data } });
  if (user && !user.emailVerified) {
    await sendVerification(user.id, user.email);
  }
  return generic;
}
