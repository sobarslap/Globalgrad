import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/actions/profile";
import { signOutAction } from "@/lib/actions/auth";
import {
  getPublishedPrograms,
  getPublishedScholarships,
} from "@/lib/data/catalog";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
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
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            GlobalGrad
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.email}
            </span>
            <ThemeToggle />
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

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
