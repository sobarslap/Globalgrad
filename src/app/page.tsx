import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/ui/hero-1";
import { Interactive3D } from "@/components/blocks/interactive-3d";
import { FeaturesSection } from "@/components/blocks/features-section";
import { HowItWorks } from "@/components/blocks/how-it-works";
import { IntegrationsSection } from "@/components/blocks/integrations-section";
import { TestimonialsSection } from "@/components/blocks/testimonials-section";
import { CtaLamp } from "@/components/blocks/cta-lamp";

export default async function Home() {
  const t = await getTranslations("Landing");
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          ctaLabel={t("cta")}
          ctaHref="/sign-up"
        />
        <Interactive3D />
        <FeaturesSection />
        <HowItWorks />
        <IntegrationsSection />
        <TestimonialsSection />
        <CtaLamp />
      </main>
      <Footer />
    </>
  );
}
