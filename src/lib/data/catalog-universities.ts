import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

export const PAGE_SIZE = 30;

export type CatalogUni = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  city: string | null;
  website: string | null;
};

export type CatalogPage = {
  rows: CatalogUni[];
  total: number;
  page: number;
  pageCount: number;
};

/**
 * Paginated, filterable browse over the imported university catalog. Filters by
 * country code and a case-insensitive name search. Kept off `unstable_cache`
 * because the query is parameterized per request (country + search + page).
 */
export async function getCatalogUniversities(opts: {
  countryCode?: string;
  q?: string;
  page?: number;
}): Promise<CatalogPage> {
  const page = Math.max(1, opts.page ?? 1);
  const where = {
    ...(opts.countryCode ? { countryCode: opts.countryCode } : {}),
    ...(opts.q
      ? { name: { contains: opts.q, mode: "insensitive" as const } }
      : {}),
  };

  const [total, rows] = await Promise.all([
    db.catalogUniversity.count({ where }),
    db.catalogUniversity.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return {
    rows,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

/** Distinct countries in the catalog with their university counts, for the filter. */
export const getCatalogCountryFacets = unstable_cache(
  async () => {
    const groups = await db.catalogUniversity.groupBy({
      by: ["countryCode", "country"],
      _count: { _all: true },
      orderBy: { country: "asc" },
    });
    return groups.map((g) => ({
      code: g.countryCode,
      name: g.country,
      count: g._count._all,
    }));
  },
  ["catalog-country-facets"],
  { revalidate: 3600, tags: ["catalog-universities"] },
);
