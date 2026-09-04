import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { MobileNav } from "@/components/site/mobile-nav";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/countries", label: "Countries" },
  { href: "/#testimonials", label: "Students" },
];

export async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="tracking-tight">GlobalGrad</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <MobileNav
            items={
              isLoggedIn
                ? [...links, { href: "/dashboard", label: "Dashboard" }]
                : [
                    ...links,
                    { href: "/sign-in", label: "Sign in" },
                    { href: "/sign-up", label: "Get started" },
                  ]
            }
          />
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <form action={signOutAction}>
                <Button type="submit" size="sm" variant="outline">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
