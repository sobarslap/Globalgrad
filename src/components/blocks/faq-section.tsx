import { headers } from "next/headers";
import { ChevronDown } from "lucide-react";
import { Eyebrow } from "@/components/marketing/kit";

/**
 * FAQ block. Uses native <details>/<summary> for expand/collapse — accessible
 * and JS-free — and emits FAQPage structured data (with the CSP nonce) so the
 * questions are eligible for rich results. Server component.
 */
const faqs = [
  {
    q: "How does GlobalGrad decide which universities fit me?",
    a: "You build a profile (GPA, test scores, budget, target countries and field). A readiness engine scores you, then a matching engine sorts universities into Safe, Target, and Reach buckets. Every result shows the reasoning, so you can see why a school landed where it did.",
  },
  {
    q: "Is the guidance official or guaranteed?",
    a: "No. GlobalGrad is an informational decision-support tool, not legal, immigration, or financial advice, and it never guarantees admission, a scholarship, or a visa. Always confirm deadlines, requirements, and fees with the official university or government source before acting.",
  },
  {
    q: "Where does the data come from?",
    a: "It runs on a curated, realistic dataset — countries, universities, programs, scholarships, and anonymized past-applicant outcomes — chosen to demonstrate the full workflow. Public-source insights are shown with citations. It is representative rather than an exhaustive live catalog.",
  },
  {
    q: "How does the scholarship eligibility engine work?",
    a: "It compares your nationality, GPA, and research or work signals against each scholarship's criteria and returns a matching percentage, so you can focus on the awards you're actually competitive for instead of guessing.",
  },
  {
    q: "Can it estimate the real cost of a degree?",
    a: "Yes. The cost calculator adds tuition, living costs, visa, insurance, flights, and an emergency buffer, converts currencies, and a funding-gap analyzer compares the total against your budget to suggest scholarships or lower-cost alternatives.",
  },
  {
    q: "Is my data private, and can I delete it?",
    a: "Your profile is yours. Passwords are hashed, traffic is over HTTPS, and you can export or permanently delete your account and its data from Settings at any time. See the Privacy Policy for details.",
  },
];

export async function FaqSection() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col items-center text-center">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-muted-foreground">
          What GlobalGrad does, how it works, and how it treats your data.
        </p>
      </div>

      <div className="mt-12 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/40">
        {faqs.map((f) => (
          <details key={f.q} className="group px-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-medium transition-colors hover:text-foreground">
              {f.q}
              <ChevronDown
                className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
