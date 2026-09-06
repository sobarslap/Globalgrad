import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/site/app-sidebar";
import { AppTopbar } from "@/components/site/app-topbar";
import { buildAppNav } from "@/components/site/app-nav";

/**
 * Shell for every logged-in route: a persistent left sidebar nav rail + a slim
 * top action bar (the v-skeleton-8 layout). Individual pages render only their
 * content into the scrollable column on the right.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const t = await getTranslations("Nav");
  const nav = buildAppNav(t, session?.user?.role);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        primary={nav.primary}
        explore={nav.explore}
        roleNav={nav.roleNav}
        settings={nav.settings}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
