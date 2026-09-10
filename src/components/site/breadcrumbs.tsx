import Link from "next/link";
import { headers } from "next/headers";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/site";

export type Crumb = { label: string; href?: string };

/**
 * Accessible breadcrumb trail with matching BreadcrumbList JSON-LD. The last
 * item is the current page (no link). Emitting the structured data here keeps
 * navigation and SEO in sync from a single source. Async so it can read the
 * per-request CSP nonce — the strict script-src drops nonce-less inline scripts.
 */
export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}${c.href === "/" ? "" : c.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
        {trail.map((c, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !isLast ? (
                <Link href={c.href} className="transition-colors hover:text-foreground">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-foreground">
                  {c.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
