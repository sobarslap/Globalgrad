import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { MobileNav } from "@/components/site/mobile-nav";
import { MoreMenu } from "@/components/site/more-menu";
import { NotificationBell } from "@/components/site/notification-bell";
import { getMyNotifications, getUnreadCount } from "@/lib/data/notifications";

export async function AppHeader() {
  const session = await auth();
  const t = await getTranslations("Nav");
  const role = session?.user?.role;
  const userId = session?.user?.id;
  const [notifications, unread] = userId
    ? await Promise.all([getMyNotifications(userId, 15), getUnreadCount(userId)])
    : [[], 0];

  // Nav labels are translated (C8); hrefs are stable.
  const primaryNav = [
    { href: "/feed", label: t("feed") },
    { href: "/dashboard", label: t("dashboard") },
    { href: "/search", label: t("search") },
    { href: "/advisor", label: t("advisor") },
    { href: "/applications", label: t("applications") },
    { href: "/calendar", label: t("calendar") },
    { href: "/cost", label: t("cost") },
  ];
  const secondaryNav = [
    { href: "/countries", label: t("countries") },
    { href: "/map", label: t("map") },
    { href: "/compare", label: t("compare") },
    { href: "/visa", label: t("visa") },
    { href: "/similar", label: t("similar") },
    { href: "/reality", label: t("reality") },
    { href: "/insights", label: t("insights") },
  ];
  const roleNav = [
    ...(role === "CONTENT_MANAGER" || role === "ADMIN"
      ? [{ href: "/content", label: t("content") }]
      : []),
    ...(role === "ADMIN" ? [{ href: "/admin", label: t("admin") }] : []),
  ];
  const moreNav = [...secondaryNav, ...roleNav];
  const allNav = [
    ...primaryNav,
    ...moreNav,
    { href: "/settings", label: t("settings") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3 lg:gap-6">
          <MobileNav items={allNav} />
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            GlobalGrad
          </Link>
          <nav className="hidden items-center gap-4 lg:flex">
            {primaryNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
            <MoreMenu items={moreNav} />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            {session?.user?.email}
          </Link>
          {userId && <NotificationBell initial={notifications} unread={unread} />}
          <LanguageSwitcher />
          <ThemeToggle />
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm">
              {t("signOut")}
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
