import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/blocks/hero";
import { Features8 } from "@/components/blocks/features-8";
import { FeaturesSection } from "@/components/blocks/features-section";
import { HowItWorks } from "@/components/blocks/how-it-works";
import { IntegrationsSection } from "@/components/blocks/integrations-section";
import { TestimonialsSection } from "@/components/blocks/testimonials-section";
import { PricingSection } from "@/components/blocks/pricing-section";
import { FaqSection } from "@/components/blocks/faq-section";
import { CtaSection } from "@/components/blocks/cta-section";

export default async function Home() {
  const t = await getTranslations("Landing");
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("highlight")}
          subtitle={t("subtitle")}
          ctaText={t("cta")}
        />
        <Features8 />
        <FeaturesSection />
        <HowItWorks />
        <IntegrationsSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
