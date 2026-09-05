"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import {
  diffRequirements,
  summarizeDiffs,
  type Requirements,
} from "@/lib/engines/requirements";

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

type ContentKind = "university" | "program" | "scholarship" | "insight";

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
  else if (kind === "insight")
    await db.insightSource.update({ where: { id }, data: { published } });
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

const requirementsSchema = z.object({
  minCgpa: z.number().min(0).max(4),
  minIelts: z.number().min(0).max(9),
  admitCgpa: z.number().min(0).max(4),
  admitIelts: z.number().min(0).max(9),
});

/**
 * Update a program's admission requirements — CONTENT_MANAGER or ADMIN.
 * Detects which requirements changed, records them (RequirementChange), and
 * notifies every student who has an application to that program (Module 2, F4:
 * Requirement Monitor). No-ops cleanly when nothing actually changed.
 */
export async function updateProgramRequirements(
  programId: string,
  input: unknown
): Promise<ActionResult> {
  const actorId = await requireRole("CONTENT_MANAGER", "ADMIN");
  if (!actorId) return { ok: false, error: "Not authorized." };

  const parsed = requirementsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid requirement values." };

  const program = await db.program.findUnique({
    where: { id: programId },
    select: {
      minCgpa: true,
      minIelts: true,
      admitCgpa: true,
      admitIelts: true,
      programName: true,
      university: { select: { name: true } },
    },
  });
  if (!program) return { ok: false, error: "Program not found." };

  const current: Requirements = {
    minCgpa: program.minCgpa,
    minIelts: program.minIelts,
    admitCgpa: program.admitCgpa,
    admitIelts: program.admitIelts,
  };
  const diffs = diffRequirements(current, parsed.data);
  if (diffs.length === 0) return { ok: true }; // nothing changed

  await db.program.update({ where: { id: programId }, data: parsed.data });
  await db.requirementChange.createMany({
    data: diffs.map((d) => ({
      programId,
      field: d.field,
      oldValue: String(d.oldValue),
      newValue: String(d.newValue),
    })),
  });

  // Notify affected students (those tracking this program).
  const apps = await db.application.findMany({
    where: { programId },
    select: { userId: true },
  });
  const label = `${program.university.name} — ${program.programName}`;
  const summary = summarizeDiffs(diffs);
  const stamp = Date.now();
  for (const a of apps) {
    await notify({
      userId: a.userId,
      type: "REQUIREMENT_CHANGE",
      title: `Requirements changed — ${label}`,
      body: summary,
      href: "/applications",
      dedupeKey: `reqchange:${programId}:${stamp}`,
    });
  }

  await audit(actorId, "program.requirements.update", `${programId}: ${summary}`);
  revalidatePath("/content");
  revalidatePath("/applications");
  return { ok: true };
}
