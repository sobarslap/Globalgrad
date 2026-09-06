import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How GlobalGrad collects, uses, and protects your data — the account details, profile inputs, and usage information behind your study-abroad recommendations.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "September 6, 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <header className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {UPDATED}</p>
        <p className="mt-6 text-muted-foreground">
          This policy explains what GlobalGrad collects, why, and the choices you
          have. GlobalGrad is an educational decision-support tool; we collect the
          minimum needed to generate your recommendations and keep your account
          secure.
        </p>
      </header>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Information we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-foreground">Account data</span> —
              your name, email address, and a securely hashed password (we never
              store passwords in plain text).
            </li>
            <li>
              <span className="font-medium text-foreground">Profile inputs</span> —
              the academic and preference details you enter (GPA, test scores,
              budget, target countries) that drive readiness scoring and matching.
            </li>
            <li>
              <span className="font-medium text-foreground">Usage data</span> —
              basic, aggregated interaction and error data used to keep the service
              working and improve it.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. How we use it</h2>
          <p className="mt-3">
            We use your data to generate recommendations, save your applications and
            checklists, send transactional emails you request (verification,
            password reset, deadline reminders), and secure the account. We do not
            sell your personal data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Third-party processors</h2>
          <p className="mt-3">
            We share data only with the service providers needed to operate:
            hosting and database infrastructure, an email delivery provider for
            transactional messages, an error-monitoring service, and an AI provider
            that powers the advisor (your questions are processed to generate a
            response). Each processes data only to provide its service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Cookies</h2>
          <p className="mt-3">
            We use strictly necessary cookies for authentication and your language
            and theme preferences. We do not use advertising cookies. You can
            manage non-essential cookies from the consent banner.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Data retention & security</h2>
          <p className="mt-3">
            We keep your data while your account is active. Passwords are hashed
            (argon2id), traffic is served over HTTPS, and access to authenticated
            areas is protected. You can delete your account at any time from
            Settings, which removes your associated data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Your rights</h2>
          <p className="mt-3">
            You can access, correct, export, or delete your personal data. To make
            a request, contact us at{" "}
            <a href={`mailto:${SITE.email}`} className="text-foreground underline underline-offset-4">
              {SITE.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
          <p className="mt-3">
            Questions about this policy? Email{" "}
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
