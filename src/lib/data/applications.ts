import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { ApplicationStatus, DocStatus } from "@prisma/client";

export interface ChecklistItemView {
  id: string;
  name: string;
  status: DocStatus;
}

export interface DeadlineView {
  id: string;
  title: string;
  dueDate: string; // ISO
  daysLeft: number;
}

export interface ApplicationView {
  id: string;
  status: ApplicationStatus;
  program: {
    id: string;
    university: string;
    programName: string;
    field: string;
  };
  checklist: ChecklistItemView[];
  deadlines: DeadlineView[];
  progress: number; // 0–100 (submitted docs / total)
}

const dayMs = 1000 * 60 * 60 * 24;

/** The signed-in user's tracked applications, with checklist + program deadlines. */
export async function getMyApplications(): Promise<ApplicationView[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const apps = await db.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    include: {
      program: {
        include: {
          university: { select: { name: true } },
          deadlines: true,
        },
      },
      checklist: { orderBy: { name: "asc" } },
    },
  });

  const now = Date.now();
  return apps.map((a) => {
    const total = a.checklist.length;
    const done = a.checklist.filter((c) => c.status === "SUBMITTED").length;
    return {
      id: a.id,
      status: a.status,
      program: {
        id: a.program.id,
        university: a.program.university.name,
        programName: a.program.programName,
        field: a.program.field,
      },
      checklist: a.checklist.map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
      })),
      deadlines: a.program.deadlines
        .map((d) => ({
          id: d.id,
          title: d.title,
          dueDate: d.dueDate.toISOString(),
          daysLeft: Math.ceil((d.dueDate.getTime() - now) / dayMs),
        }))
        .sort((x, y) => x.daysLeft - y.daysLeft),
      progress: total ? Math.round((done / total) * 100) : 0,
    };
  });
}
