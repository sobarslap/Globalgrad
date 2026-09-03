import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function hasRole(...allowed: Role[]): Promise<boolean> {
  const session = await auth();
  const role = session?.user?.role;
  return !!role && allowed.includes(role);
}

export interface AdminStats {
  users: number;
  students: number;
  applications: number;
  universities: number;
  programs: number;
  scholarships: number;
  unpublished: number;
}

export async function getAdminStats(): Promise<AdminStats | null> {
  if (!(await hasRole("ADMIN"))) return null;
  const [
    users,
    students,
    applications,
    universities,
    programs,
    scholarships,
    unpubU,
    unpubP,
    unpubS,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "STUDENT" } }),
    db.application.count(),
    db.university.count(),
    db.program.count(),
    db.scholarship.count(),
    db.university.count({ where: { published: false } }),
    db.program.count({ where: { published: false } }),
    db.scholarship.count({ where: { published: false } }),
  ]);
  return {
    users,
    students,
    applications,
    universities,
    programs,
    scholarships,
    unpublished: unpubU + unpubP + unpubS,
  };
}

export interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  applications: number;
  createdAt: string;
}

export async function getAllUsers(): Promise<UserRow[]> {
  if (!(await hasRole("ADMIN"))) return [];
  const rows = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { applications: true } } },
  });
  return rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    applications: u._count.applications,
    createdAt: u.createdAt.toISOString(),
  }));
}

export interface AuditRow {
  id: string;
  action: string;
  detail: string | null;
  actor: string | null;
  createdAt: string;
}

export async function getRecentAuditLogs(limit = 20): Promise<AuditRow[]> {
  if (!(await hasRole("ADMIN"))) return [];
  const rows = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { email: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    action: r.action,
    detail: r.detail,
    actor: r.user?.email ?? null,
    createdAt: r.createdAt.toISOString(),
  }));
}

export interface ContentItem {
  id: string;
  label: string;
  sub: string;
  published: boolean;
}
export interface ContentOverview {
  universities: ContentItem[];
  programs: ContentItem[];
  scholarships: ContentItem[];
}

export async function getContentOverview(): Promise<ContentOverview | null> {
  if (!(await hasRole("CONTENT_MANAGER", "ADMIN"))) return null;
  const [universities, programs, scholarships] = await Promise.all([
    db.university.findMany({
      orderBy: { name: "asc" },
      include: { country: { select: { name: true } } },
    }),
    db.program.findMany({
      orderBy: { programName: "asc" },
      include: { university: { select: { name: true } } },
    }),
    db.scholarship.findMany({ orderBy: { name: "asc" } }),
  ]);
  return {
    universities: universities.map((u) => ({
      id: u.id,
      label: u.name,
      sub: u.country?.name ?? "—",
      published: u.published,
    })),
    programs: programs.map((p) => ({
      id: p.id,
      label: p.programName,
      sub: p.university.name,
      published: p.published,
    })),
    scholarships: scholarships.map((s) => ({
      id: s.id,
      label: s.name,
      sub: s.provider,
      published: s.published,
    })),
  };
}
