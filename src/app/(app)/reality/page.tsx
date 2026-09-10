import { redirect } from "next/navigation";
import { Home, Briefcase, Languages, Wallet, AlertTriangle, Coins } from "lucide-react";
import { auth } from "@/lib/auth";
import {
  REALITY_CHECKS,
  type RealityCheck,
  type RealityLevel,
} from "@/lib/data/reality";

export const metadata = { title: "University reality check" };

const LABEL: Record<RealityLevel, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
};

/** Qualitative level pill. `higherIsWorse` flips the good/bad colour. */
function LevelPill({
  level,
  higherIsWorse,
}: {
  level: RealityLevel;
  higherIsWorse?: boolean;
}) {
  const bad = higherIsWorse ? level === "high" : level === "low";
  const good = higherIsWorse ? level === "low" : level === "high";
  const cls = good
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
    : bad
      ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
      : "border-amber-500/40 bg-amber-500/10 text-amber-500";
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {LABEL[level]}
    </span>
  );
}

function Row({
  icon: Icon,
  label,
  level,
  higherIsWorse,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  level: RealityLevel;
  higherIsWorse?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </span>
      <LevelPill level={level} higherIsWorse={higherIsWorse} />
    </div>
  );
}

function Card({ r }: { r: RealityCheck }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
      <h3 className="font-semibold">{r.university}</h3>
      <p className="text-sm text-muted-foreground">{r.city}</p>
      <div className="mt-4 space-y-2">
        <Row icon={Home} label="Housing pressure" level={r.housingPressure} higherIsWorse />
        <Row icon={Wallet} label="Cost of living" level={r.costOfLiving} higherIsWorse />
        <Row icon={Briefcase} label="Part-time availability" level={r.partTimeAvailability} />
        <Row icon={Languages} label="Language barrier" level={r.languageBarrier} higherIsWorse />
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
      <main id="main-content" className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            University reality check
          </h1>
          <p className="mt-1 text-muted-foreground">
            Practical, widely-reported context official pages gloss over — cost of
            living, housing pressure, part-time work and language.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {REALITY_CHECKS.map((r) => (
            <Card key={r.university} r={r} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          These are general, qualitative indicators drawn from broadly-known
          public information about each city — not precise per-university scores.
          Always verify with current students, official pages and city cost data.
        </p>
      </main>
    </div>
  );
}
