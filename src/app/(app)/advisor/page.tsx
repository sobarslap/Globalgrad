import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, UserCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/actions/profile";
import { getPublishedPrograms } from "@/lib/data/catalog";
import { scoreReadinessByTier } from "@/lib/engines/readiness";
import { AdvisorChat } from "@/components/advisor/advisor-chat";

export const metadata = { title: "AI advisor" };

export default async function AdvisorPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const [profile, programs] = await Promise.all([
    getMyProfile(),
    getPublishedPrograms(),
  ]);
  const tiers = profile ? scoreReadinessByTier(profile, programs) : null;
  const topTier = tiers?.find((t) => t.programCount > 0);

  return (
    <div className="min-h-screen">
      <main id="main-content" className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <Sparkles className="h-6 w-6 text-primary" /> AI Study Abroad Advisor
          </h1>
          <p className="mt-1 text-muted-foreground">
            Grounded in your profile and the platform&apos;s matching results — it
            explains and builds on your matches, it doesn&apos;t replace them.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <AdvisorChat />

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <UserCircle className="h-4 w-4 text-primary" /> Profile grounding
              </h2>
              {profile ? (
                <dl className="mt-4 space-y-2.5 text-sm">
                  {[
                    ["Target field", profile.targetField],
                    ["Degree level", profile.targetLevel],
                    ["CGPA", `${profile.cgpa.toFixed(2)} / 4.0`],
                    ["English", `IELTS ${profile.ielts.toFixed(1)}`],
                    ["GRE", profile.greTotal ? String(profile.greTotal) : "—"],
                    ["Nationality", profile.nationality],
                    [
                      "Readiness",
                      topTier ? `${topTier.label} · ${topTier.score}/100` : "—",
                    ],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium capitalize">{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Add your profile so answers are personalized.</p>
                  <Link
                    href="/dashboard"
                    className="mt-3 inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                  >
                    Build profile
                  </Link>
                </div>
              )}
              <p className="mt-4 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                Answers are grounded in your profile and verified platform data.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
