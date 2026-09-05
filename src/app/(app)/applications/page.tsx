import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { auth } from "@/lib/auth";
import {
  getMyApplications,
  getMyRequirementChanges,
} from "@/lib/data/applications";
import { getMyProfile } from "@/lib/actions/profile";
import { AppHeader } from "@/components/site/app-header";
import { ApplicationsBoard } from "@/components/applications/applications-board";

export const metadata = { title: "Applications — GlobalGrad" };

export default async function ApplicationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const [applications, profile, requirementChanges] = await Promise.all([
    getMyApplications(),
    getMyProfile(),
    getMyRequirementChanges(),
  ]);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main id="main-content" className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Applications
          </h1>
          <p className="mt-1 text-muted-foreground">
            Build a balanced plan, track each application from planning to
            enrollment, work through document checklists, and watch deadlines.
          </p>
        </div>
        {requirementChanges.length > 0 && (
          <section className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" /> Requirement changes on your
              tracked programs
            </h2>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {requirementChanges.map((c) => (
                <li key={c.id}>
                  <span className="font-medium text-foreground">{c.program}</span>{" "}
                  — {c.field}: {c.oldValue} → {c.newValue}
                </li>
              ))}
            </ul>
          </section>
        )}
        <ApplicationsBoard
          applications={applications}
          hasProfile={!!profile}
        />
      </main>
    </div>
  );
}
