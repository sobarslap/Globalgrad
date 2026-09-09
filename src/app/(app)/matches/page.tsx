import Link from "next/link";
import { redirect } from "next/navigation";
import { Compass } from "lucide-react";
import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/actions/profile";
import { getPublishedPrograms } from "@/lib/data/catalog";
import { MatchExplorer } from "@/components/matches/match-explorer";

export const metadata = { title: "University matching" };

export default async function MatchesPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const [profile, programs] = await Promise.all([
    getMyProfile(),
    getPublishedPrograms(),
  ]);

  return (
    <div className="min-h-screen">
      <main id="main-content" className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <Compass className="h-6 w-6 text-primary" /> University matching
          </h1>
          <p className="mt-1 text-muted-foreground">
            Programs grouped by fit — each card explains exactly why it lands in
            Safe, Target or Reach for your profile.
          </p>
        </div>

        {profile ? (
          <MatchExplorer profile={profile} programs={programs} />
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
            <p className="text-muted-foreground">
              Complete your profile to see personalized matches.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Build your profile
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
