"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { studentProfileSchema } from "@/lib/domain/schema";
import type { StudentProfile } from "@/lib/domain/types";

export type SaveProfileResult = { ok: boolean; error?: string };

/**
 * Upsert the signed-in user's StudentProfile. Ownership is enforced server-side:
 * the row is always keyed by the session user id — a client cannot target another
 * user (no IDOR). Input is re-validated with Zod; the client is never trusted.
 */
export async function saveProfile(
  input: unknown
): Promise<SaveProfileResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not authenticated." };

  const parsed = studentProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid." };
  }
  const v = parsed.data;
  const userId = session.user.id;

  const data = {
    cgpa: v.cgpa,
    ielts: v.ielts,
    researchPapers: v.researchPapers,
    workExperienceMonths: v.workExperienceMonths,
    targetLevel:
      v.targetLevel === "bachelors"
        ? ("BACHELORS" as const)
        : v.targetLevel === "phd"
          ? ("PHD" as const)
          : ("MASTERS" as const),
    targetField: v.targetField,
    nationality: v.nationality,
    greTotal: v.greTotal ?? null,
  };

  await db.studentProfile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

/** Load the signed-in user's profile mapped to the engine's StudentProfile shape. */
export async function getMyProfile(): Promise<StudentProfile | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const p = await db.studentProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!p) return null;

  return {
    cgpa: p.cgpa,
    ielts: p.ielts,
    researchPapers: p.researchPapers,
    workExperienceMonths: p.workExperienceMonths,
    targetLevel:
      p.targetLevel === "BACHELORS"
        ? "bachelors"
        : p.targetLevel === "PHD"
          ? "phd"
          : "masters",
    targetField: p.targetField,
    nationality: p.nationality,
    greTotal: p.greTotal ?? undefined,
  };
}
