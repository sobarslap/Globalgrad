import { redirect } from "next/navigation";
import { Lightbulb } from "lucide-react";
import { auth } from "@/lib/auth";
import { getInsightCountries } from "@/lib/data/insights";
import { AppHeader } from "@/components/site/app-header";
import { InsightExplorer } from "@/components/insights/insight-explorer";

export const metadata = { title: "Public insights — GlobalGrad" };

export default async function InsightsPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const countries = await getInsightCountries();

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main id="main-content" className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <Lightbulb className="h-6 w-6 text-primary" /> Public insight engine
          </h1>
          <p className="mt-1 text-muted-foreground">
            Common advice, warnings and student experiences — synthesized from
            curated public sources (FAQs, embassy pages, blogs, forums), with
            citations you can verify.
          </p>
        </div>
        <InsightExplorer countries={countries} />
      </main>
    </div>
  );
}
