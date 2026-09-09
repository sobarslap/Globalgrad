import Link from "next/link";
import { redirect } from "next/navigation";
import { Coins } from "lucide-react";
import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/actions/profile";
import { getPublishedScholarships } from "@/lib/data/catalog";
import { ScholarshipWizard } from "@/components/scholarships/scholarship-wizard";

export const metadata = { title: "Scholarships" };

export default async function ScholarshipsPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const [profile, scholarships] = await Promise.all([
    getMyProfile(),
    getPublishedScholarships(),
  ]);

  return (
    <div className="min-h-screen">
      <main id="main-content" className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <Coins className="h-6 w-6 text-primary" /> Scholarships
          </h1>
          <p className="mt-1 text-muted-foreground">
            Find funding you are actually eligible for — filtered by funding
            type, coverage, basis and deadline, and matched to your profile.
          </p>
        </div>

        {profile ? (
          <ScholarshipWizard profile={profile} scholarships={scholarships} />
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
            <p className="text-muted-foreground">
              Complete your profile to see scholarships matched to you.
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
