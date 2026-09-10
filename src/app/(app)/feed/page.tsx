import { redirect } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Coins,
  CalendarClock,
  Globe2,
  Sparkles,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/actions/profile";
import { getMyApplications } from "@/lib/data/applications";
import {
  getPublishedPrograms,
  getPublishedScholarships,
  getCountries,
} from "@/lib/data/catalog";
import { matchPrograms } from "@/lib/engines/matching";
import { matchScholarships } from "@/lib/engines/scholarship";
import { rankCountries } from "@/lib/engines/country";

export const metadata = { title: "Your feed — GlobalGrad" };

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  detail: string;
  href: string;
  tone: string;
};

export default async function FeedPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const profile = await getMyProfile();

  if (!profile) {
    return (
      <div className="min-h-screen">
        <main id="main-content" className="mx-auto max-w-3xl px-6 py-10">
          <h1 className="text-3xl font-semibold tracking-tight">Your feed</h1>
          <p className="mt-3 text-muted-foreground">
            Add your profile to get a personalized feed of matches, scholarships
            and deadlines.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Build your profile →
          </Link>
        </main>
      </div>
    );
  }

  const [programs, scholarships, countries, apps] = await Promise.all([
    getPublishedPrograms(),
    getPublishedScholarships(),
    getCountries(),
    getMyApplications(),
  ]);

  const items: Item[] = [];

  // Matching universities
  const matching = matchPrograms(profile, programs);
  for (const m of [...matching.safe, ...matching.target].slice(0, 3)) {
    items.push({
      icon: GraduationCap,
      tag: "Matching university",
      title: `${m.program.university} — ${m.program.programName}`,
      detail: `Readiness ${m.score} · ${m.bucket.toUpperCase()} for your profile.`,
      href: "/dashboard",
      tone: "text-violet-400",
    });
  }

  // Scholarships you qualify for
  const sch = matchScholarships(profile, scholarships).filter((s) => s.eligible);
  for (const s of sch.slice(0, 2)) {
    items.push({
      icon: Coins,
      tag: "Scholarship match",
      title: s.scholarship.name,
      detail: `${s.matchPercent}% funding match — ${s.scholarship.provider}.`,
      href: "/cost",
      tone: "text-amber-400",
    });
  }

  // Upcoming deadlines from tracked applications
  const deadlines = apps
    .flatMap((a) =>
      a.deadlines.map((d) => ({ ...d, uni: a.program.university }))
    )
    .filter((d) => d.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);
  for (const d of deadlines) {
    items.push({
      icon: CalendarClock,
      tag: "Upcoming deadline",
      title: d.title,
      detail: `${d.daysLeft} days left.`,
      href: "/applications",
      tone: d.daysLeft <= 30 ? "text-rose-400" : "text-sky-400",
    });
  }

  // Country insight
  const topCountry = rankCountries(countries)[0];
  if (topCountry) {
    items.push({
      icon: Globe2,
      tag: "Country insight",
      title: `${topCountry.country.flagEmoji ?? ""} ${topCountry.country.name} fits you well`,
      detail: `Top macro fit (${topCountry.score}/100) on cost, work visa and part-time rights.`,
      href: "/countries",
      tone: "text-emerald-400",
    });
  }

  return (
    <div className="min-h-screen">
      <main id="main-content" className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <Sparkles className="h-6 w-6 text-primary" /> Your feed
          </h1>
          <p className="mt-1 text-muted-foreground">
            Personalized updates based on your profile — matches, scholarships,
            deadlines and insights.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <Link
                key={i}
                href={it.href}
                className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-primary/40"
              >
                <span className="mt-0.5">
                  <Icon className={`h-5 w-5 ${it.tone}`} />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {it.tag}
                  </div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {it.detail}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
