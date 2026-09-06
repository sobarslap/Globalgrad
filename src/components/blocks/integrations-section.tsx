import {
  Bot,
  Database,
  Mail,
  Map,
  BadgeDollarSign,
  Search,
  GraduationCap,
} from "lucide-react";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { Eyebrow } from "@/components/marketing/kit";

export function IntegrationsSection() {
  return (
    <section id="integrations" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <Eyebrow>Always-fresh data</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.05]">
            Wired into the sources that matter
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            GlobalGrad continuously collects and verifies data from official
            university pages, scholarship portals and embassy resources — then
            enriches it with AI, live exchange rates and maps so your decisions
            rest on current, trustworthy information.
          </p>
          <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            {[
              "AI advisor & summarization",
              "Vector search over insights",
              "Deadline & scholarship alerts",
              "Live cost & exchange rates",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden">
          <span className="pointer-events-none flex flex-col items-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <GraduationCap className="h-8 w-8" />
            </span>
          </span>

          {/* Inner ring */}
          <OrbitingCircles className="size-[42px] border-none bg-transparent" duration={20} delay={0} radius={90}>
            <Bot className="h-6 w-6 text-primary" />
          </OrbitingCircles>
          <OrbitingCircles className="size-[42px] border-none bg-transparent" duration={20} delay={10} radius={90}>
            <Search className="h-6 w-6 text-accent" />
          </OrbitingCircles>

          {/* Outer ring */}
          <OrbitingCircles className="size-[52px] border-none bg-transparent" radius={175} duration={26} reverse>
            <Database className="h-6 w-6 text-emerald-500" />
          </OrbitingCircles>
          <OrbitingCircles className="size-[52px] border-none bg-transparent" radius={175} duration={26} delay={9} reverse>
            <Mail className="h-6 w-6 text-rose-500" />
          </OrbitingCircles>
          <OrbitingCircles className="size-[52px] border-none bg-transparent" radius={175} duration={26} delay={18} reverse>
            <Map className="h-6 w-6 text-sky-500" />
          </OrbitingCircles>
          <OrbitingCircles className="size-[52px] border-none bg-transparent" radius={175} duration={26} delay={13} reverse>
            <BadgeDollarSign className="h-6 w-6 text-amber-500" />
          </OrbitingCircles>
        </div>
      </div>
    </section>
  );
}
