import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  getAdminStats,
  getAllUsers,
  getRecentAuditLogs,
} from "@/lib/data/admin";
import { AppHeader } from "@/components/site/app-header";
import { UserTable } from "@/components/admin/user-table";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Admin — GlobalGrad" };

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const [stats, users, logs] = await Promise.all([
    getAdminStats(),
    getAllUsers(),
    getRecentAuditLogs(),
  ]);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
            <p className="mt-1 text-muted-foreground">
              Platform overview, user roles, and activity.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/content">Content review</Link>
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            <Stat label="Users" value={stats.users} />
            <Stat label="Students" value={stats.students} />
            <Stat label="Applications" value={stats.applications} />
            <Stat label="Universities" value={stats.universities} />
            <Stat label="Programs" value={stats.programs} />
            <Stat label="Scholarships" value={stats.scholarships} />
            <Stat label="Unpublished" value={stats.unpublished} />
          </div>
        )}

        <section>
          <h2 className="mb-3 text-xl font-semibold">Users &amp; roles</h2>
          <UserTable users={users} currentUserId={session.user.id} />
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Recent activity</h2>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {logs.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2"
                >
                  <span>
                    <span className="font-medium">{l.action}</span>{" "}
                    <span className="text-muted-foreground">{l.detail}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {l.actor ?? "system"} ·{" "}
                    {new Date(l.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
