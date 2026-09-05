import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/actions/profile";
import {
  getProgramsWithCost,
  getPublishedScholarships,
  getCountries,
} from "@/lib/data/catalog";
import { matchScholarships } from "@/lib/engines/scholarship";
import { getFxRates } from "@/lib/fx";
import { AppHeader } from "@/components/site/app-header";
import { CostCalculator } from "@/components/cost/cost-calculator";

export const metadata = { title: "Cost & funding — GlobalGrad" };

export default async function CostPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const [profile, programs, scholarships, countries, fx] = await Promise.all([
    getMyProfile(),
    getProgramsWithCost(),
    getPublishedScholarships(),
    getCountries(),
    getFxRates(),
  ]);

  const eligibleScholarships = profile
    ? matchScholarships(profile, scholarships)
        .filter((m) => m.eligible)
        .map((m) => ({
          name: m.scholarship.name,
          amountUsd: m.scholarship.amountUsd,
        }))
    : [];

  const cheaperCountries = countries
    .filter((c) => c.monthlyLivingCostUsd != null)
    .sort((a, b) => (a.monthlyLivingCostUsd ?? 0) - (b.monthlyLivingCostUsd ?? 0))
    .slice(0, 3)
    .map((c) => ({ name: c.name, monthlyLivingUsd: c.monthlyLivingCostUsd ?? 0 }));

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main id="main-content" className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Cost &amp; funding
          </h1>
          <p className="mt-1 text-muted-foreground">
            Estimate the full cost of your degree, then see whether your budget
            covers it — and how to close any gap.
          </p>
        </div>
        <CostCalculator
          programs={programs}
          cheaperCountries={cheaperCountries}
          eligibleScholarships={eligibleScholarships}
          fx={fx}
        />
      </main>
    </div>
  );
}
