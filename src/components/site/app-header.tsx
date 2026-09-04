import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/theme-toggle";

const baseNav = [
  { href: "/feed", label: "Feed" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/advisor", label: "Advisor" },
  { href: "/applications", label: "Applications" },
  { href: "/cost", label: "Cost" },
  { href: "/visa", label: "Visa" },
  { href: "/countries", label: "Countries" },
  { href: "/similar", label: "Similar" },
  { href: "/reality", label: "Reality" },
  { href: "/insights", label: "Insights" },
];

export async function AppHeader() {
  const session = await auth();
  const role = session?.user?.role;
  const navItems = [
    ...baseNav,
    ...(role === "CONTENT_MANAGER" || role === "ADMIN"
      ? [{ href: "/content", label: "Content" }]
      : []),
    ...(role === "ADMIN" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            GlobalGrad
          </Link>
          <nav className="hidden items-center gap-3 lg:flex">
            {navItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {session?.user?.email}
          </span>
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
