import Link from "next/link";
import { GraduationCap } from "lucide-react";

/**
 * Footer — rebuilt from Aceternity UI "Simple footer with four grids": a brand
 * column beside four link columns, with a divider and copyright row. Themeable.
 */
const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Countries", href: "/countries" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "AI advisor", href: "/advisor" },
      { label: "Compare", href: "/compare" },
      { label: "Insights", href: "/insights" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Similar students", href: "/similar" },
      { label: "Funding", href: "/cost" },
      { label: "Visa hub", href: "/visa" },
      { label: "Deadlines", href: "/calendar" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Create profile", href: "/sign-up" },
      { label: "Settings", href: "/settings" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </span>
              GlobalGrad
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              A personalized decision-support platform for study abroad &amp;
              scholarship planning.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} GlobalGrad. All rights reserved.</p>
          <p>Built for students, grounded in data.</p>
        </div>
      </div>
    </footer>
  );
}
