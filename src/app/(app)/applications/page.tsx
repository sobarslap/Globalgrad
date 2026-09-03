import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMyApplications } from "@/lib/data/applications";
import { getMyProfile } from "@/lib/actions/profile";
import { AppHeader } from "@/components/site/app-header";
import { ApplicationsBoard } from "@/components/applications/applications-board";

export const metadata = { title: "Applications — GlobalGrad" };

export default async function ApplicationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const [applications, profile] = await Promise.all([
    getMyApplications(),
    getMyProfile(),
  ]);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Applications
          </h1>
          <p className="mt-1 text-muted-foreground">
            Build a balanced plan, track each application from planning to
            enrollment, work through document checklists, and watch deadlines.
          </p>
        </div>
        <ApplicationsBoard
          applications={applications}
          hasProfile={!!profile}
        />
      </main>
    </div>
  );
}
