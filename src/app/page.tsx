import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/ui/hero-1";
import { Interactive3D } from "@/components/blocks/interactive-3d";
import { FeaturesSection } from "@/components/blocks/features-section";
import { HowItWorks } from "@/components/blocks/how-it-works";
import { IntegrationsSection } from "@/components/blocks/integrations-section";
import { TestimonialsSection } from "@/components/blocks/testimonials-section";
import { CtaLamp } from "@/components/blocks/cta-lamp";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero
          eyebrow="Study abroad, decided with data"
          title="Get in. Get funded. Go global."
          subtitle="GlobalGrad scores your readiness, matches you to Safe / Target / Reach universities, finds scholarships you actually qualify for, and plans the money, deadlines and visa — with an AI advisor grounded in real data."
          ctaLabel="Start free"
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
