import { redirect } from "next/navigation";
import { Home, Briefcase, Languages, Smile, AlertTriangle, Coins } from "lucide-react";
import { auth } from "@/lib/auth";
import { REALITY_CHECKS, type RealityCheck } from "@/lib/data/reality";
import { AppHeader } from "@/components/site/app-header";

export const metadata = { title: "University reality check — GlobalGrad" };

/** 5-segment rating. `invert` = higher is worse (housing difficulty, language barrier). */
function Rating({
  value,
  invert = false,
}: {
  value: number;
  invert?: boolean;
}) {
  const good = invert ? value <= 2 : value >= 4;
  const mid = value === 3;
  const color = good
    ? "bg-emerald-500"
    : mid
      ? "bg-amber-500"
      : "bg-rose-500";
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-5 rounded-full ${i <= value ? color : "bg-muted"}`}
        />
      ))}
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  invert,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  invert?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </span>
      <Rating value={value} invert={invert} />
    </div>
  );
}

function Card({ r }: { r: RealityCheck }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
      <h3 className="font-semibold">{r.university}</h3>
      <div className="mt-4 space-y-2">
        <Row icon={Home} label="Housing difficulty" value={r.housingDifficulty} invert />
        <Row icon={Briefcase} label="Part-time availability" value={r.partTimeAvailability} />
        <Row icon={Languages} label="Language barrier" value={r.languageBarrier} invert />
        <Row icon={Smile} label="Student satisfaction" value={r.studentSatisfaction} />
      </div>
      <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-sm">
        <p className="flex gap-2 text-muted-foreground">
          <Coins className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <span>
            <span className="font-medium text-foreground">Hidden costs.</span>{" "}
            {r.hiddenCosts}
          </span>
        </p>
        <p className="flex gap-2 text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
          <span>
            <span className="font-medium text-foreground">Watch out.</span>{" "}
            {r.watchOut}
          </span>
        </p>
      </div>
    </div>
  );
}

export default async function RealityPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            University reality check
          </h1>
          <p className="mt-1 text-muted-foreground">
            The practical stuff official pages gloss over — housing, hidden
            costs, part-time work, language and student satisfaction.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {REALITY_CHECKS.map((r) => (
            <Card key={r.university} r={r} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Ratings are indicative and curated for demonstration — cross-check with
          current students, subreddits and university forums.
        </p>
      </main>
    </div>
  );
}
