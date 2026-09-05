"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type ActionResult = { ok: boolean; error?: string };

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/** Mark one notification read. Ownership enforced via userId in the filter. */
export async function markNotificationRead(id: string): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Not authenticated." };
  // updateMany with userId in the where clause = no IDOR (can't read others').
  await db.notification.updateMany({
    where: { id, userId },
    data: { read: true },
  });
  revalidatePath("/");
  return { ok: true };
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Not authenticated." };
  await db.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  revalidatePath("/");
  return { ok: true };
}
