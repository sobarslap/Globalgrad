"use client";

import { useMemo, useState, useTransition } from "react";
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

  return (
    <div className="space-y-10">
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
