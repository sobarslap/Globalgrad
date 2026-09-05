import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { CalendarItem } from "@/lib/engines/calendar";

const STATUS_LABEL: Record<string, string> = {
  PLANNED: "Planned",
  PREPARING: "Preparing",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER_RECEIVED: "Offer received",
  REJECTED: "Rejected",
  VISA_PROCESSING: "Visa processing",
  ENROLLED: "Enrolled",
};

/**
 * Calendar items for the current user: upcoming/past deadlines on tracked
 * programs, plus each application's latest status change as a milestone.
 */
export async function getMyCalendarItems(): Promise<CalendarItem[]> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const apps = await db.application.findMany({
    where: { userId },
    include: {
      program: {
        include: {
          university: { select: { name: true } },
          deadlines: true,
        },
      },
    },
  });

  const items: CalendarItem[] = [];
  for (const a of apps) {
    const label = `${a.program.university.name} — ${a.program.programName}`;
    for (const d of a.program.deadlines) {
      items.push({
        id: `deadline-${d.id}`,
        title: d.title,
        date: d.dueDate,
        kind: "deadline",
        meta: label,
      });
    }
    items.push({
      id: `status-${a.id}`,
      title: `${STATUS_LABEL[a.status] ?? a.status} — ${label}`,
      date: a.updatedAt,
      kind: "status",
      meta: "Application status",
    });
  }
  return items;
}
