"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { generateSecret, otpauthUri, verifyTotp } from "@/lib/totp";
import { rateLimit } from "@/lib/rate-limit";

type Result = { ok: boolean; error?: string };

async function requireUser() {
  const session = await auth();
  return session?.user?.id ? { id: session.user.id, email: session.user.email ?? "" } : null;
}

/**
 * Begin 2FA setup: generate + store a secret (not yet enabled) and return the
 * otpauth URI + secret for the authenticator app. Enabling requires a confirmed
 * code (confirmTwoFactor).
 */
export async function startTwoFactorSetup(): Promise<
  Result & { secret?: string; uri?: string }
> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const secret = generateSecret();
  await db.user.update({
    where: { id: user.id },
    data: { twoFactorSecret: secret, twoFactorEnabled: false },
  });
  return { ok: true, secret, uri: otpauthUri(secret, user.email) };
}

/** Confirm setup: verify a code against the pending secret, then enable 2FA. */
export async function confirmTwoFactor(code: string): Promise<Result> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const rl = await rateLimit(`2fa-confirm:${user.id}`, 10, 5 * 60 * 1000);
  if (!rl.ok) return { ok: false, error: "Too many attempts. Try again shortly." };

  const row = await db.user.findUnique({
    where: { id: user.id },
    select: { twoFactorSecret: true },
  });
  if (!row?.twoFactorSecret) return { ok: false, error: "Start setup first." };
  if (!verifyTotp(row.twoFactorSecret, code))
    return { ok: false, error: "That code isn't valid. Try again." };

  await db.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: true },
  });
  await db.auditLog.create({
    data: { userId: user.id, action: "2fa.enable" },
  });
  revalidatePath("/settings");
  return { ok: true };
}

/** Disable 2FA — requires the account password and a current code. */
export async function disableTwoFactor(
  password: string,
  code: string,
): Promise<Result> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const rl = await rateLimit(`2fa-disable:${user.id}`, 10, 5 * 60 * 1000);
  if (!rl.ok) return { ok: false, error: "Too many attempts. Try again shortly." };

  const row = await db.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true, twoFactorSecret: true, twoFactorEnabled: true },
  });
  if (!row?.twoFactorEnabled || !row.twoFactorSecret)
    return { ok: false, error: "Two-factor is not enabled." };
  if (!row.passwordHash || !(await verifyPassword(row.passwordHash, password)))
    return { ok: false, error: "Incorrect password." };
  if (!verifyTotp(row.twoFactorSecret, code))
    return { ok: false, error: "That code isn't valid." };

  await db.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });
  await db.auditLog.create({
    data: { userId: user.id, action: "2fa.disable" },
  });
  revalidatePath("/settings");
  return { ok: true };
}
