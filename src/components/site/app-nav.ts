/**
 * Shared navigation model for the logged-in app shell. Consumed by the desktop
 * sidebar and the mobile drawer so both stay in sync. Labels are translated;
 * hrefs are stable and used as the icon key in the sidebar.
 */
export interface NavItem {
  href: string;
  label: string;
}

export interface AppNav {
  primary: NavItem[];
  explore: NavItem[];
  roleNav: NavItem[];
  settings: NavItem;
  /** Flattened list for the mobile drawer. */
  all: NavItem[];
}

export function buildAppNav(
  t: (key: string) => string,
  role: string | undefined
): AppNav {
  const primary: NavItem[] = [
    { href: "/feed", label: t("feed") },
    { href: "/dashboard", label: t("dashboard") },
    { href: "/search", label: t("search") },
    { href: "/advisor", label: t("advisor") },
    { href: "/applications", label: t("applications") },
    { href: "/calendar", label: t("calendar") },
    { href: "/cost", label: t("cost") },
  ];
  const explore: NavItem[] = [
    { href: "/countries", label: t("countries") },
    { href: "/universities", label: t("universities") },
    { href: "/map", label: t("map") },
    { href: "/compare", label: t("compare") },
    { href: "/visa", label: t("visa") },
    { href: "/similar", label: t("similar") },
    { href: "/reality", label: t("reality") },
    { href: "/insights", label: t("insights") },
  ];
  const roleNav: NavItem[] = [
    ...(role === "CONTENT_MANAGER" || role === "ADMIN"
      ? [{ href: "/content", label: t("content") }]
      : []),
    ...(role === "ADMIN" ? [{ href: "/admin", label: t("admin") }] : []),
  ];
  const settings: NavItem = { href: "/settings", label: t("settings") };

  return {
    primary,
    explore,
    roleNav,
    settings,
    all: [...primary, ...explore, ...roleNav, settings],
  };
}
