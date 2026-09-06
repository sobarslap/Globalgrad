import type { Metadata } from "next";
import { Mail, MapPin, MessageSquare, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ContactForm } from "@/components/site/contact-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions, feedback, or a partnership idea? Send a message and hear back from the person who builds GlobalGrad.",
  alternates: { canonical: "/contact" },
};

// lucide-react 1.x dropped brand glyphs; inline the two marks we link to.
function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.19 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.19.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="relative">
      {/* Signature tinted glow, consistent with the landing hero. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,hsl(var(--primary)/0.14),transparent)]" />

      <div className="relative mx-auto max-w-5xl px-6 py-14 sm:py-16">
        <Breadcrumbs items={[{ label: "Contact" }]} />

        <div className="mx-auto mt-6 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Get in touch
          </span>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Let&apos;s talk about your{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              study-abroad plan
            </span>
          </h1>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Product feedback, a bug, a partnership, or just a question about
            where to study — send it over. It reaches a real person, not a
            ticket queue.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_1.15fr]">
          {/* Founder note */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border/60 bg-card/50 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-semibold text-white shadow-lg shadow-primary/30">
                  ZI
                </div>
                <div>
                  <p className="font-semibold">Zubairul Islam</p>
                  <p className="text-sm text-muted-foreground">
                    Founder &amp; Developer
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Hi — I&apos;m the one who designs and builds GlobalGrad. I
                started it because choosing where to study abroad is drowning in
                noise and half-truths, and I wanted decisions grounded in data
                instead. If something&apos;s confusing, broken, or missing, I
                genuinely want to hear it. Every message comes to me directly.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={SITE.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect on LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
                <a
                  href={SITE.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GlobalGrad on GitHub"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            <ul className="space-y-3">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: SITE.email,
                  href: `mailto:${SITE.email}`,
                },
                {
                  icon: Clock,
                  label: "Typical reply time",
                  value: "Within a day",
                },
                {
                  icon: MapPin,
                  label: "Based in",
                  value: "Dhaka, Bangladesh",
                },
              ].map(({ icon: Icon, label, value, href }) => {
                const body = (
                  <>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                        {label}
                      </span>
                      <span className="text-sm font-medium">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40"
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3">
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Form */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4 text-primary" />
              Send a message
            </div>
            <ContactForm />
            <p className="mt-4 text-xs text-muted-foreground">
              Your details are used only to reply to you. See the{" "}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
