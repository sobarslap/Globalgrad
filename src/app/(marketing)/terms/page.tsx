import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of GlobalGrad, including the important note that its guidance is informational and not legal, immigration, or financial advice.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "September 6, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />

      <header className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {UPDATED}</p>
        <p className="mt-6 text-muted-foreground">
          By creating an account or using GlobalGrad, you agree to these terms.
          Please read them — section 3 explains an important limit on how you
          should rely on the platform&apos;s guidance.
        </p>
      </header>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. The service</h2>
          <p className="mt-3">
            GlobalGrad is an educational decision-support platform that helps you
            explore study-abroad options — readiness scoring, university matching,
            scholarship eligibility, cost and funding analysis, visa preparation,
            and an AI advisor. It is provided for personal, non-commercial use.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Your account</h2>
          <p className="mt-3">
            You are responsible for the accuracy of the information you provide and
            for keeping your login credentials confidential. You must be old enough
            to consent to processing of your data in your jurisdiction. Do not
            misuse the service, attempt to breach its security, or use it to violate
            any law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. Informational only — not professional advice
          </h2>
          <p className="mt-3">
            GlobalGrad&apos;s recommendations, scores, cost estimates, and advisor
            responses are informational and generated from a curated dataset and
            models. They are <span className="font-medium text-foreground">not</span>{" "}
            legal, immigration, or financial advice, and are not a guarantee of
            admission, scholarship, visa approval, or any outcome. Always verify
            deadlines, requirements, fees, and rules with the official university,
            scholarship body, or government source before you act.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Intellectual property</h2>
          <p className="mt-3">
            The platform, its content, and its underlying models are owned by
            GlobalGrad. You retain ownership of the profile information you enter.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Availability & changes</h2>
          <p className="mt-3">
            The service is provided &quot;as is&quot; and may change, be
            interrupted, or be discontinued. We may update these terms; material
            changes will be reflected by the &quot;last updated&quot; date above.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Limitation of liability</h2>
          <p className="mt-3">
            To the maximum extent permitted by law, GlobalGrad is not liable for
            decisions made in reliance on the platform, or for indirect or
            consequential losses arising from its use.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
          <p className="mt-3">
            Questions about these terms? Email{" "}
            <a href={`mailto:${SITE.email}`} className="text-foreground underline underline-offset-4">
              {SITE.email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
