import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Check, X, Award } from "lucide-react";
import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/actions/profile";
import { getAnonymizedApplicants } from "@/lib/data/applicants";
import { findSimilar } from "@/lib/engines/similar";
import { AppHeader } from "@/components/site/app-header";

export const metadata = { title: "Similar students — GlobalGrad" };

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export default async function SimilarPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const profile = await getMyProfile();
  if (!profile) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-3xl px-6 py-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Similar students
          </h1>
          <p className="mt-3 text-muted-foreground">
            Add your profile to compare with past applicants like you.
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

  const applicants = await getAnonymizedApplicants();
  const result = findSimilar(profile, applicants);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <Users className="h-6 w-6 text-primary" /> Similar student finder
          </h1>
          <p className="mt-1 text-muted-foreground">
            Anonymized past applicants with a profile like yours (CGPA{" "}
            {profile.cgpa}, IELTS {profile.ielts}) — where they applied, and how
            they fared.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="Similar applicants" value={String(result.count)} />
          <Stat label="Admit rate" value={`${result.admitRate}%`} />
          <Stat label="Scholarship rate" value={`${result.scholarshipRate}%`} />
        </div>

        {result.topUniversities.length > 0 && (
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Where similar students applied
            </h2>
            <div className="overflow-hidden rounded-2xl border border-border/60">
              <table className="w-full text-sm">
                <thead className="border-b border-border/60 text-left text-muted-foreground">
                  <tr>
                    <th className="p-3 font-medium">University</th>
                    <th className="p-3 font-medium">Applications</th>
                    <th className="p-3 font-medium">Admits</th>
                    <th className="p-3 font-medium">Admit rate</th>
                  </tr>
                </thead>
                <tbody>
                  {result.topUniversities.map((u) => (
                    <tr
                      key={u.university}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="p-3 font-medium">{u.university}</td>
                      <td className="p-3 text-muted-foreground">
                        {u.applications}
                      </td>
                      <td className="p-3 text-muted-foreground">{u.admits}</td>
                      <td className="p-3">
                        <span
                          className={
                            u.admitRate >= 50
                              ? "text-emerald-500"
                              : "text-amber-500"
                          }
                        >
                          {u.admitRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-xl font-semibold">Profiles like yours</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {result.matches.map((m, i) => (
              <div
                key={m.applicant.id}
                className="rounded-2xl border border-border/60 bg-card/40 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">Applicant #{i + 1}</p>
                  <span className="text-xs text-primary">
                    {m.similarity}% similar
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  CGPA {m.applicant.cgpa} · IELTS {m.applicant.ielts} ·{" "}
                  {m.applicant.researchPapers} paper(s) · {m.applicant.nationality}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {m.applicant.outcomes.map((o, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      {o.admitted ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <X className="h-4 w-4 text-rose-500" />
                      )}
                      <span className="flex-1">{o.university}</span>
                      {o.scholarship && (
                        <Award className="h-4 w-4 text-amber-500" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-muted-foreground">
          Profiles are anonymized and synthetic for demonstration. Outcomes vary
          by year, program, and application quality.
        </p>
      </main>
    </div>
  );
}
