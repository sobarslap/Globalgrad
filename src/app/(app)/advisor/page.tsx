import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { AppHeader } from "@/components/site/app-header";
import { AdvisorChat } from "@/components/advisor/advisor-chat";

export const metadata = { title: "AI Advisor — GlobalGrad" };

export default async function AdvisorPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main id="main-content" className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <Sparkles className="h-6 w-6 text-primary" /> AI Study Abroad Advisor
          </h1>
          <p className="mt-1 text-muted-foreground">
            Grounded in your profile and the platform&apos;s matching results.
          </p>
        </div>
        <AdvisorChat />
      </main>
    </div>
  );
}
