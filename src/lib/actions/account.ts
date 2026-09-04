"use server";

import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";

export type DeleteState = { error?: string };

/**
 * Permanently delete the signed-in user's account and all personal data.
 * Cascades remove profile, applications, checklists, sessions, and reset tokens;
 * audit logs are anonymized (userId set null). Requires typing DELETE to confirm.
 */
export async function deleteMyAccount(
  _prev: DeleteState,
  formData: FormData
): Promise<DeleteState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const confirm = String(formData.get("confirm") ?? "").trim();
  if (confirm !== "DELETE")
    return { error: 'Type "DELETE" to confirm account deletion.' };

  await db.user.delete({ where: { id: session.user.id } });

  // Clear the session and leave the app.
  await signOut({ redirectTo: "/" });
  return {};
}
