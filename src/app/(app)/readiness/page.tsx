import Link from "next/link";
import { redirect } from "next/navigation";
import { Gauge } from "lucide-react";
import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/actions/profile";
import { getPublishedPrograms } from "@/lib/data/catalog";
import { scoreReadinessByTier } from "@/lib/engines/readiness";
import { Scorecard } from "@/components/readiness/scorecard";

export const metadata = { title: "Readiness scorecard" };

export default async function ReadinessPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const [profile, programs] = await Promise.all([
    getMyProfile(),
    getPublishedPrograms(),
  ]);

  const tiers = profile ? scoreReadinessByTier(profile, programs) : null;

  return (
    <div className="min-h-screen">
      <main id="main-content" className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <Gauge className="h-6 w-6 text-primary" /> Readiness scorecard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Where you stand for top, mid and accessible programs — scored on
            academics, English, research, experience and test scores, with
            concrete next steps per tier.
          </p>
        </div>

        {tiers ? (
          <Scorecard tiers={tiers} />
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
            <p className="text-muted-foreground">
              Complete your profile to generate your readiness scorecard.
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
