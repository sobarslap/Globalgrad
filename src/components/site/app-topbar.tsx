import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { MobileNav } from "@/components/site/mobile-nav";
import { NotificationBell } from "@/components/site/notification-bell";
import { buildAppNav } from "@/components/site/app-nav";
import { getMyNotifications, getUnreadCount } from "@/lib/data/notifications";

/**
 * AppTopbar — slim header inside the app shell content column. Nav lives in the
 * sidebar; the top bar carries actions only (user, notifications, language,
 * theme, sign out) plus a logo + drawer on mobile where the sidebar is hidden.
 */
export async function AppTopbar() {
  const session = await auth();
  const t = await getTranslations("Nav");
  const role = session?.user?.role;
  const userId = session?.user?.id;
  const [notifications, unread] = userId
    ? await Promise.all([getMyNotifications(userId, 15), getUnreadCount(userId)])
    : [[], 0];

  const nav = buildAppNav(t, role);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border/40 bg-background/70 px-4 backdrop-blur-xl lg:px-8 print:hidden">
      <div className="flex items-center gap-2">
        <MobileNav items={nav.all}>
          <form action={signOutAction}>
            <Button type="submit" variant="outline" size="sm" className="w-full">
              {t("signOut")}
            </Button>
          </form>
        </MobileNav>
        {/* Mobile-only brand (sidebar is hidden below lg) */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold lg:hidden"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          GlobalGrad
        </Link>
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
        <form action={signOutAction} className="hidden lg:block">
          <Button type="submit" variant="ghost" size="sm">
            {t("signOut")}
          </Button>
        </form>
      </div>
    </header>
  );
}
