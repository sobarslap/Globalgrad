import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { MobileNav } from "@/components/site/mobile-nav";
import { HeaderShell } from "@/components/site/header-shell";

export async function Navbar() {
  const session = await auth();
  const t = await getTranslations("Nav");
  const isLoggedIn = !!session?.user;

  const links = [
    { href: "/#features", label: t("features") },
    { href: "/#how", label: t("howItWorks") },
    { href: "/countries", label: t("countries") },
    { href: "/#testimonials", label: t("students") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <HeaderShell>
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
                ? [...links, { href: "/dashboard", label: t("dashboard") }]
                : [
                    ...links,
                    { href: "/sign-in", label: t("signIn") },
                    { href: "/sign-up", label: t("getStarted") },
                  ]
            }
          />
          <LanguageSwitcher />
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">{t("dashboard")}</Link>
              </Button>
              <form action={signOutAction}>
                <Button type="submit" size="sm" variant="outline">
                  {t("signOut")}
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
                <Link href="/sign-in">{t("signIn")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">{t("getStarted")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </HeaderShell>
  );
}
