import Link from "next/link";
import { Search, ExternalLink, GraduationCap } from "lucide-react";
import {
  getCatalogUniversities,
  getCatalogCountryFacets,
  PAGE_SIZE,
} from "@/lib/data/catalog-universities";

export const metadata = {
  title: "Universities",
  description:
    "Browse real universities across 22 study-abroad destinations, imported from the open Hipolabs dataset.",
};

type SP = { country?: string; q?: string; page?: string };

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const countryCode = sp.country || undefined;
  const q = sp.q?.trim() || undefined;
  const page = Number(sp.page) || 1;

  const [facets, result] = await Promise.all([
    getCatalogCountryFacets(),
    getCatalogUniversities({ countryCode, q, page }),
  ]);

  const totalAll = facets.reduce((s, f) => s + f.count, 0);
  const activeCountry = facets.find((f) => f.code === countryCode);

  // Preserve filters across pagination links.
  const linkFor = (p: number) => {
    const params = new URLSearchParams();
    if (countryCode) params.set("country", countryCode);
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/universities${s ? `?${s}` : ""}`;
  };

  const from = result.total === 0 ? 0 : (result.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(result.page * PAGE_SIZE, result.total);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight md:text-4xl">
          <GraduationCap className="h-7 w-7 text-primary" />
          Universities
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {totalAll.toLocaleString()} real universities across {facets.length}{" "}
          destinations, imported from the open{" "}
          <a
            href="https://github.com/Hipo/university-domains-list"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Hipolabs
          </a>{" "}
          dataset. Verify details on each university&apos;s official site.
        </p>
      </div>

      {/* Filters (GET form, no JS needed) */}
      <form method="GET" className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search by name…"
            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <select
          name="country"
          defaultValue={countryCode ?? ""}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All countries ({totalAll.toLocaleString()})</option>
          {facets.map((f) => (
            <option key={f.code} value={f.code}>
              {f.name} ({f.count})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Filter
        </button>
      </form>

      <p className="mb-3 text-sm text-muted-foreground">
        {result.total.toLocaleString()} result
        {result.total === 1 ? "" : "s"}
        {activeCountry ? ` in ${activeCountry.name}` : ""}
        {q ? ` matching “${q}”` : ""}
        {result.total > 0 ? ` · showing ${from}–${to}` : ""}
      </p>

      {result.rows.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card/40 p-10 text-center text-muted-foreground">
          No universities match your filters.
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {result.rows.map((u) => (
            <li
              key={u.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card/40 p-4"
            >
              <div className="min-w-0">
                <p className="font-medium leading-snug">{u.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {u.country}
                  {u.city ? ` · ${u.city}` : ""}
                </p>
              </div>
              {u.website && (
                <a
                  href={u.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${u.name} website`}
                  className="shrink-0 rounded-lg border border-border/60 p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {result.pageCount > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <PageLink
            href={linkFor(result.page - 1)}
            disabled={result.page <= 1}
            label="← Previous"
          />
          <span className="text-sm text-muted-foreground">
            Page {result.page} of {result.pageCount}
          </span>
          <PageLink
            href={linkFor(result.page + 1)}
            disabled={result.page >= result.pageCount}
            label="Next →"
          />
        </div>
      )}
    </main>
  );
}

function PageLink({
  href,
  disabled,
  label,
}: {
  href: string;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded-md border border-border/60 px-4 py-2 text-sm text-muted-foreground/50">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-md border border-border/60 px-4 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-card/60"
    >
      {label}
    </Link>
  );
}
