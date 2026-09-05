import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { MobileNav } from "@/components/site/mobile-nav";
import { MoreMenu } from "@/components/site/more-menu";

// Shown directly in the top bar on desktop.
const primaryNav = [
  { href: "/feed", label: "Feed" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/search", label: "Search" },
  { href: "/advisor", label: "Advisor" },
  { href: "/applications", label: "Applications" },
  { href: "/cost", label: "Cost" },
];

// Tucked into the "More" dropdown on desktop.
const secondaryNav = [
  { href: "/countries", label: "Countries" },
  { href: "/map", label: "Map" },
  { href: "/compare", label: "Compare" },
  { href: "/visa", label: "Visa" },
  { href: "/similar", label: "Similar" },
  { href: "/reality", label: "Reality" },
  { href: "/insights", label: "Insights" },
];

export async function AppHeader() {
  const session = await auth();
  const role = session?.user?.role;
  const roleNav = [
    ...(role === "CONTENT_MANAGER" || role === "ADMIN"
      ? [{ href: "/content", label: "Content" }]
      : []),
    ...(role === "ADMIN" ? [{ href: "/admin", label: "Admin" }] : []),
  ];
  const moreNav = [...secondaryNav, ...roleNav];
  const allNav = [
    ...primaryNav,
    ...moreNav,
    { href: "/settings", label: "Settings" },
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
          <ThemeToggle />
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
