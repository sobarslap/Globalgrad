import "server-only";
import { db } from "@/lib/db";
import type { NotificationType } from "@prisma/client";

interface NotifyInput {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  href?: string;
  /** Stable key to avoid re-notifying for the same event (per user). */
  dedupeKey?: string;
}

/**
 * Create an in-app notification. When a dedupeKey is supplied, re-notifying for
 * the same event is a no-op (idempotent) via the (userId, dedupeKey) unique key.
 * Never throws into the caller — a failed notification must not break the action
 * that triggered it.
 */
export async function notify(input: NotifyInput): Promise<void> {
  try {
    if (input.dedupeKey) {
      await db.notification.upsert({
        where: { userId_dedupeKey: { userId: input.userId, dedupeKey: input.dedupeKey } },
        create: {
          userId: input.userId,
          type: input.type,
          title: input.title,
          body: input.body,
          href: input.href,
          dedupeKey: input.dedupeKey,
        },
        // Keep the existing row (and its read state) if the event repeats.
        update: {},
      });
    } else {
      await db.notification.create({
        data: {
          userId: input.userId,
          type: input.type,
          title: input.title,
          body: input.body,
          href: input.href,
        },
      });
    }
  } catch (e) {
    console.error("[notify] failed", (e as Error).message);
  }
}
