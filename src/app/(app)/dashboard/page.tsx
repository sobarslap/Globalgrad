"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { Results } from "@/components/dashboard/results";
import { matchPrograms } from "@/lib/engines/matching";
import { matchScholarships } from "@/lib/engines/scholarship";
import { samplePrograms, sampleScholarships } from "@/lib/data/sample";
import type { StudentProfile } from "@/lib/domain/types";
import type { StudentProfileValues } from "@/lib/domain/schema";

const STORAGE_KEY = "globalgrad:profile";

export default function DashboardPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load any saved profile once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      /* ignore malformed/blocked storage */
    }
    setLoaded(true);
  }, []);

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const results = useMemo(() => {
    if (!profile) return null;
    return {
      matching: matchPrograms(profile, samplePrograms),
      scholarships: matchScholarships(profile, sampleScholarships),
    };
  }, [profile]);

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
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Dashboard</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Readiness &amp; matching
          </h1>
          <p className="mt-1 text-muted-foreground">
            Enter your profile to see your readiness score, Safe / Target / Reach
            universities, and scholarships you qualify for.
          </p>
        </div>

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

        {loaded && !profile && (
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
      </main>
    </div>
  );
}
