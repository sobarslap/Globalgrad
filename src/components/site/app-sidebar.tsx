"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Bot,
  FileText,
  Calendar,
  Wallet,
  Globe2,
  Map,
  GitCompareArrows,
  Plane,
  Users,
  ShieldAlert,
  Sparkles,
  Newspaper,
  FilePen,
  Shield,
  Settings,
  GraduationCap,
  Compass,
  Gauge,
  Coins,
  Circle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/site/app-nav";

/**
 * AppSidebar — persistent left nav rail for the logged-in app (the v-skeleton-8
 * shell). Highlights the active route and maps each href to an icon. Hidden
 * below `lg`, where the top bar's mobile drawer takes over.
 */
const icons: Record<string, LucideIcon> = {
  "/feed": Newspaper,
  "/dashboard": LayoutDashboard,
  "/matches": Compass,
  "/readiness": Gauge,
  "/scholarships": Coins,
  "/search": Search,
  "/advisor": Bot,
  "/applications": FileText,
  "/calendar": Calendar,
  "/cost": Wallet,
  "/countries": Globe2,
  "/universities": GraduationCap,
  "/map": Map,
  "/compare": GitCompareArrows,
  "/visa": Plane,
  "/similar": Users,
  "/reality": ShieldAlert,
  "/insights": Sparkles,
  "/content": FilePen,
  "/admin": Shield,
  "/settings": Settings,
};

function NavLink({ href, label }: NavItem) {
  const pathname = usePathname();
  const Icon = icons[href] ?? Circle;
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function AppSidebar({
  primary,
  explore,
  roleNav,
  settings,
}: {
  primary: NavItem[];
  explore: NavItem[];
  roleNav: NavItem[];
  settings: NavItem;
}) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border/40 bg-card/30 lg:flex">
      <Link
        href="/"
        className="flex h-16 items-center gap-2 px-5 font-semibold tracking-tight"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </span>
        GlobalGrad
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {primary.map((n) => (
            <NavLink key={n.href} {...n} />
          ))}
        </div>

        <div className="space-y-1">
          <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
            Explore
          </p>
          {explore.map((n) => (
            <NavLink key={n.href} {...n} />
          ))}
        </div>

        {roleNav.length > 0 && (
          <div className="space-y-1">
            <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              Manage
            </p>
            {roleNav.map((n) => (
              <NavLink key={n.href} {...n} />
            ))}
          </div>
        )}
      </nav>

      <div className="border-t border-border/40 px-3 py-3">
        <NavLink {...settings} />
      </div>
    </aside>
  );
}
