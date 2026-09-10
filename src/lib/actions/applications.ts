"use server";

import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import type { ApplicationStatus, DocStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getMyProfile } from "@/lib/actions/profile";
import { getPublishedPrograms } from "@/lib/data/catalog";
import { matchPrograms, buildStrategy } from "@/lib/engines/matching";

/** Documents generated for every new application (Smart Document Checklist). */
const DEFAULT_DOCS = [
  "Passport",
  "Academic transcripts",
  "IELTS / TOEFL certificate",
  "Statement of Purpose (SOP)",
  "Letter of Recommendation 1",
  "Letter of Recommendation 2",
  "CV / Résumé",
  "Bank statement / financial proof",
  "Passport-size photos",
  "Application fee payment",
];

type ActionResult = { ok: boolean; error?: string };

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/** Track a program as an application (idempotent), generating its checklist. */
export async function addApplication(programId: string): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Not authenticated." };

  const program = await db.program.findFirst({
    where: { id: programId, published: true },
    select: { id: true },
  });
  if (!program) return { ok: false, error: "Program not found." };

  const existing = await db.application.findUnique({
    where: { userId_programId: { userId, programId } },
    select: { id: true },
  });
  if (existing) return { ok: true }; // already tracked

  await db.application.create({
    data: {
      userId,
      programId,
      status: "PLANNED",
      checklist: {
        create: DEFAULT_DOCS.map((name) => ({ name })),
      },
    },
  });

  revalidatePath("/applications");
  return { ok: true };
}

/** One-click Application Strategy Builder: create a balanced 3/4/2 plan. */
export async function buildBalancedPlan(): Promise<
  ActionResult & { created?: number }
> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Not authenticated." };

  const profile = await getMyProfile();
  if (!profile)
    return { ok: false, error: "Add your profile first to get a plan." };

  const programs = await getPublishedPrograms();
  const matching = matchPrograms(profile, programs);
  const plan = buildStrategy(matching); // 3 safe / 4 target / 2 reach

  const chosen = [...plan.safe, ...plan.target, ...plan.reach];
  let created = 0;
  for (const m of chosen) {
    const exists = await db.application.findUnique({
      where: { userId_programId: { userId, programId: m.program.id } },
      select: { id: true },
    });
    if (exists) continue;
    await db.application.create({
      data: {
        userId,
        programId: m.program.id,
        status: "PLANNED",
        checklist: { create: DEFAULT_DOCS.map((name) => ({ name })) },
      },
    });
    created++;
  }

  revalidatePath("/applications");
  return { ok: true, created };
}

/** Update an application's status — ownership enforced. */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Not authenticated." };

  const result = await db.application.updateMany({
    where: { id: applicationId, userId }, // userId in filter = ownership guard
    data: { status },
  });
  if (result.count === 0) return { ok: false, error: "Not found." };

  revalidatePath("/applications");
  return { ok: true };
}

/** Set a checklist item's status — ownership verified via the parent application. */
export async function setChecklistItemStatus(
  itemId: string,
  status: DocStatus
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Not authenticated." };

  const item = await db.documentChecklistItem.findUnique({
    where: { id: itemId },
    select: { application: { select: { userId: true } } },
  });
  if (!item || item.application.userId !== userId) {
    return { ok: false, error: "Not found." };
  }

  await db.documentChecklistItem.update({
    where: { id: itemId },
    data: { status },
  });
  revalidatePath("/applications");
  return { ok: true };
}

/**
 * Remove the uploaded document from a checklist item (A3) — ownership verified
 * via the parent application. Deletes the file from UploadThing storage and
 * resets the item to PENDING.
 */
export async function removeChecklistFile(
  itemId: string
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Not authenticated." };

  const item = await db.documentChecklistItem.findUnique({
    where: { id: itemId },
    select: { fileKey: true, application: { select: { userId: true } } },
  });
  if (!item || item.application.userId !== userId) {
    return { ok: false, error: "Not found." };
  }

  if (item.fileKey) {
    try {
      await new UTApi().deleteFiles(item.fileKey);
    } catch {
      // Non-fatal: still clear the DB reference below.
    }
  }
  await db.documentChecklistItem.update({
    where: { id: itemId },
    data: { fileUrl: null, fileName: null, fileKey: null, status: "PENDING" },
  });
  revalidatePath("/applications");
  return { ok: true };
}

/** Remove a tracked application — ownership enforced. */
export async function removeApplication(
  applicationId: string
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Not authenticated." };

  const result = await db.application.deleteMany({
    where: { id: applicationId, userId },
  });
  if (result.count === 0) return { ok: false, error: "Not found." };

  revalidatePath("/applications");
  return { ok: true };
}
