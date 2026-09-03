import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/actions/profile";
import {
  getPublishedPrograms,
  getPublishedScholarships,
} from "@/lib/data/catalog";
import { AppHeader } from "@/components/site/app-header";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const [profile, programs, scholarships] = await Promise.all([
    getMyProfile(),
    getPublishedPrograms(),
    getPublishedScholarships(),
  ]);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Readiness &amp; matching
          </h1>
          <p className="mt-1 text-muted-foreground">
            Enter your profile to see your readiness score, Safe / Target /
            Reach universities, and scholarships you qualify for. Your profile is
            saved to your account.
          </p>
        </div>

        <DashboardClient
          initialProfile={profile}
          programs={programs}
          scholarships={scholarships}
        />
      </main>
    </div>
  );
}
