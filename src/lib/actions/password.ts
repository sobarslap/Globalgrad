"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { sendEmail, emailShell } from "@/lib/mailer";
import { baseUrl } from "@/lib/base-url";

export type PwState = { ok?: boolean; error?: string; message?: string };

const sha256 = (v: string) =>
  crypto.createHash("sha256").update(v).digest("hex");

const emailSchema = z.string().trim().toLowerCase().email();
const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Za-z]/, "Include a letter")
  .regex(/[0-9]/, "Include a number");

/** Step 1: request a reset link. Always returns a generic message (no enumeration). */
export async function requestPasswordReset(
  _prev: PwState,
  formData: FormData
): Promise<PwState> {
  const ip = clientIp(await headers());
  const rl = await rateLimit(`pwreset:${ip}`, 3, 60 * 60 * 1000); // 3 / hour / IP
  if (!rl.ok)
    return { error: `Too many requests. Try again in ${rl.retryAfterSec}s.` };

  const parsed = emailSchema.safeParse(formData.get("email"));
  const generic: PwState = {
    ok: true,
    message: "If an account exists for that email, a reset link is on its way.",
  };
  if (!parsed.success) return generic;

  const user = await db.user.findUnique({ where: { email: parsed.data } });
  // Only email credentials users; never reveal whether the account exists.
  if (user?.passwordHash) {
    const token = crypto.randomBytes(32).toString("hex");
    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(token),
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 min
      },
    });
    const link = `${await baseUrl()}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your GlobalGrad password",
      html: emailShell(
        "Reset your password",
        `<p>Click the link below to set a new password. It expires in 15 minutes and can be used once.</p>
         <p><a href="${link}" style="color:#7c3aed">Reset password</a></p>
         <p style="font-size:12px;color:#888">If you didn't request this, you can ignore this email.</p>`
      ),
    });
  }
  return generic;
}

/** Step 2: consume the token and set a new password. */
export async function resetPassword(
  _prev: PwState,
  formData: FormData
): Promise<PwState> {
  const token = String(formData.get("token") ?? "");
  const parsed = passwordSchema.safeParse(formData.get("password"));
  if (!token) return { error: "Invalid or missing reset token." };
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Invalid password." };

  const tokenHash = sha256(token);
  const now = new Date();

  // Atomically consume the token: the conditional updateMany only affects the
  // row while it is still unused and unexpired, so two concurrent submissions of
  // the same token can't both succeed (closes the TOCTOU race, CWE-367).
  const consumed = await db.passwordResetToken.updateMany({
    where: { tokenHash, usedAt: null, expires: { gt: now } },
    data: { usedAt: now },
  });
  if (consumed.count !== 1) {
    return { error: "This reset link is invalid or has expired." };
  }

  const record = await db.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { userId: true },
  });
  if (!record) return { error: "This reset link is invalid or has expired." };

  const passwordHash = await hashPassword(parsed.data);
  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    // Invalidate any other outstanding tokens for this user.
    db.passwordResetToken.deleteMany({
      where: { userId: record.userId, usedAt: null },
    }),
    db.auditLog.create({
      data: { userId: record.userId, action: "user.password.reset" },
    }),
  ]);

  return { ok: true, message: "Password updated. You can now sign in." };
}
