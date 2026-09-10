import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { Eyebrow } from "@/components/marketing/kit";

// Long-standing Unsplash photos (campuses, students, world, study) streamed
// through the corridor. Served over https so the CSP img-src allows them.
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=640&q=80&auto=format&fit=crop`;

const IMAGES = [
  { src: U("1541339907198-e08756dedf3f"), alt: "University campus building" },
  { src: U("1562774053-701939374585"), alt: "Library reading room" },
  { src: U("1523240795612-9a054b0db644"), alt: "Students studying together" },
  { src: U("1498243691581-b145c3f54a5a"), alt: "Stack of books" },
  { src: U("1519389950473-47ba0277781c"), alt: "Students with laptops" },
  { src: U("1607013251379-e6eecfffe234"), alt: "Campus lawn" },
  { src: U("1517048676732-d65bc937f952"), alt: "Team collaborating" },
  { src: U("1543269865-cbf427effbad"), alt: "Students on steps" },
  { src: U("1509062522246-3755977927d7"), alt: "Lecture hall" },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ImageStreamHero
          images={IMAGES}
          cards={7}
          className="h-[440px] w-full rounded-3xl border border-border/60 bg-card/40 sm:h-[520px]"
        >
          {/* readability scrim over the moving corridor */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <Eyebrow>Your global campus</Eyebrow>
            <h2 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-[3.25rem] md:leading-[1.03]">
              Every campus in the world, on one dashboard
            </h2>
            <p className="mt-4 max-w-xl text-balance text-muted-foreground md:text-lg">
              Real universities across dozens of countries — track programs,
              deadlines and requirements, and follow what matters at each one
              from a single place.
            </p>
            <Link
              href="/countries"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Explore countries
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </ImageStreamHero>
      </div>
    </section>
  );
}
