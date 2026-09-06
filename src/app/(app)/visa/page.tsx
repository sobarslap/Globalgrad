import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { VISA_GUIDES } from "@/lib/data/visa";
import { VisaHub } from "@/components/visa/visa-hub";

export const metadata = { title: "Visa preparation — GlobalGrad" };

export default async function VisaPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <div className="min-h-screen">
      <main id="main-content" className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Visa preparation
          </h1>
          <p className="mt-1 text-muted-foreground">
            Country-specific visa guidance — documents, financial proof,
            timelines, fees, and the mistakes that sink applications.
          </p>
        </div>
        <VisaHub guides={VISA_GUIDES} />
      </main>
    </div>
  );
}
