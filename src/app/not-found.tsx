import Link from "next/link";
import type { Metadata } from "next";
import { GraduationCap, Home, Compass, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for doesn't exist or has moved.",
  robots: { index: false, follow: true },
};

const suggestions = [
  { href: "/dashboard", label: "Your dashboard", icon: Compass },
  { href: "/countries", label: "Compare countries", icon: Compass },
  { href: "/visa", label: "Visa hub", icon: LifeBuoy },
  { href: "/cost", label: "Cost calculator", icon: LifeBuoy },
];

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center"
    >
      <Link
        href="/"
        className="mb-10 flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </span>
        GlobalGrad
      </Link>

      <p className="text-sm font-semibold tracking-widest text-primary">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        This page took a gap year
      </h1>
      <p className="mt-4 max-w-md text-balance text-muted-foreground">
        We couldn&apos;t find the page you were looking for. It may have moved,
        or the link might be out of date.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>

      <div className="mt-12 w-full max-w-md">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Popular pages
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {suggestions.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-4 py-3 text-left text-sm transition-colors hover:border-border hover:bg-card"
            >
              <s.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
