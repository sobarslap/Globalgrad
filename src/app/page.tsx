import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { HeroSection } from "@/components/ui/hero-section-dark";
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
        <HeroSection
          title={t("eyebrow")}
          subtitle={{ regular: t("title") + " ", gradient: t("highlight") }}
          description={t("subtitle")}
          ctaText={t("cta")}
          ctaHref="/sign-up"
          secondaryCtaText="See how it works"
          secondaryCtaHref="/#how"
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
