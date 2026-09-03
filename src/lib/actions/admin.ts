"use server";

import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type ActionResult = { ok: boolean; error?: string };

/**
 * Role guard used by every privileged action (defense in depth — middleware
 * protects the routes, but actions can be invoked directly, so we re-check the
 * session role server-side). Returns the actor's id, or null if unauthorized.
 */
async function requireRole(...allowed: Role[]): Promise<string | null> {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || !allowed.includes(role)) return null;
  return session!.user.id;
}

async function audit(userId: string, action: string, detail?: string) {
  await db.auditLog.create({ data: { userId, action, detail } });
}

/** Change a user's role — ADMIN only. Cannot change your own role (lock-out guard). */
export async function setUserRole(
  targetUserId: string,
  role: Role
): Promise<ActionResult> {
  const actorId = await requireRole("ADMIN");
  if (!actorId) return { ok: false, error: "Not authorized." };
  if (targetUserId === actorId)
    return { ok: false, error: "You can't change your own role." };

  await db.user.update({ where: { id: targetUserId }, data: { role } });
  await audit(actorId, "user.role.set", `${targetUserId} → ${role}`);

  revalidatePath("/admin");
  return { ok: true };
}

type ContentKind = "university" | "program" | "scholarship";

/** Publish/unpublish a content item — CONTENT_MANAGER or ADMIN. */
export async function setContentPublished(
  kind: ContentKind,
  id: string,
  published: boolean
): Promise<ActionResult> {
  const actorId = await requireRole("CONTENT_MANAGER", "ADMIN");
  if (!actorId) return { ok: false, error: "Not authorized." };

  if (kind === "university")
    await db.university.update({ where: { id }, data: { published } });
  else if (kind === "program")
    await db.program.update({ where: { id }, data: { published } });
  else await db.scholarship.update({ where: { id }, data: { published } });

  await audit(
    actorId,
    "content.publish",
    `${kind}:${id} → ${published ? "published" : "unpublished"}`
  );

  revalidatePath("/content");
  revalidatePath("/admin");
  return { ok: true };
}
