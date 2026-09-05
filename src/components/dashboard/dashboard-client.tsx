"use client";

import { useMemo, useState, useTransition } from "react";
import { Gauge, ShieldCheck, Target, Rocket, Coins, Info } from "lucide-react";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { Results } from "@/components/dashboard/results";
import { matchPrograms } from "@/lib/engines/matching";
import { matchScholarships } from "@/lib/engines/scholarship";
import { saveProfile } from "@/lib/actions/profile";
import type { Program, Scholarship, StudentProfile } from "@/lib/domain/types";
import type { StudentProfileValues } from "@/lib/domain/schema";

interface Props {
  initialProfile: StudentProfile | null;
  programs: Program[];
  scholarships: Scholarship[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tint: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className={`h-4 w-4 ${tint}`} />
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

export function DashboardClient({
  initialProfile,
  programs,
  scholarships,
}: Props) {
  const [profile, setProfile] = useState<StudentProfile | null>(initialProfile);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (values: StudentProfileValues) => {
    const next: StudentProfile = {
      cgpa: values.cgpa,
      ielts: values.ielts,
      researchPapers: values.researchPapers,
      workExperienceMonths: values.workExperienceMonths,
      targetLevel: values.targetLevel,
      targetField: values.targetField,
      nationality: values.nationality,
      greTotal: values.greTotal,
    };
    setProfile(next);
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const res = await saveProfile(values);
      if (res.ok) setSaved(true);
      else setError(res.error ?? "Could not save.");
    });
  };

  const results = useMemo(() => {
    if (!profile) return null;
    return {
      matching: matchPrograms(profile, programs),
      scholarships: matchScholarships(profile, scholarships),
    };
  }, [profile, programs, scholarships]);

  const readiness = useMemo(() => {
    if (!results) return null;
    const scores = results.matching.all.map((m) => m.score);
    return scores.length ? Math.max(...scores) : 0;
  }, [results]);

  const eligibleScholarships =
    results?.scholarships.filter((s) => s.eligible).length ?? 0;

  return (
    <div className="space-y-10">
      {/* Stat cards — appear once a profile is analyzed */}
      {results && readiness !== null && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={Gauge}
            label="Readiness"
            value={`${readiness}`}
            tint="text-primary"
          />
          <StatCard
            icon={ShieldCheck}
            label="Safe"
            value={results.matching.safe.length}
            tint="text-emerald-500"
          />
          <StatCard
            icon={Target}
            label="Target"
            value={results.matching.target.length}
            tint="text-amber-500"
          />
          <StatCard
            icon={Rocket}
            label="Reach"
            value={results.matching.reach.length}
            tint="text-rose-500"
          />
          <StatCard
            icon={Coins}
            label="Scholarships"
            value={eligibleScholarships}
            tint="text-sky-500"
          />
        </div>
      )}

      {/* Form + guidance side panel */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <ProfileForm
            defaultValues={
              profile
                ? {
                    cgpa: profile.cgpa,
                    ielts: profile.ielts,
                    researchPapers: profile.researchPapers,
                    workExperienceMonths: profile.workExperienceMonths,
                    targetLevel: profile.targetLevel,
                    targetField: profile.targetField,
                    nationality: profile.nationality,
                    greTotal: profile.greTotal,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
          />
          <div aria-live="polite" className="text-sm">
            {pending && <span className="text-muted-foreground">Saving…</span>}
            {saved && !pending && (
              <span className="text-emerald-500">Profile saved.</span>
            )}
            {error && <span className="text-destructive">{error}</span>}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="flex items-center gap-2 font-semibold">
              <Info className="h-4 w-4 text-primary" />
              How scoring works
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                Your CGPA, IELTS, research and experience feed a readiness score
                per university tier.
              </li>
              <li>
                Programs are sorted into{" "}
                <span className="text-emerald-500">Safe</span>,{" "}
                <span className="text-amber-500">Target</span> and{" "}
                <span className="text-rose-500">Reach</span> by your real odds.
              </li>
              <li>
                Scholarships are matched against your nationality, GPA and
                research — no irrelevant noise.
              </li>
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Your profile is saved to your account and never shared.
            </p>
          </div>
        </aside>
      </div>

      {!profile && (
        <p className="text-sm text-muted-foreground">
          Your results will appear here once you analyze a profile.
        </p>
      )}

      {results && (
        <Results
          matching={results.matching}
          scholarships={results.scholarships}
        />
      )}
    </div>
  );
}
