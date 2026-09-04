import { redirect } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import type { DegreeLevel } from "@prisma/client";
import { auth } from "@/lib/auth";
import { searchCatalog } from "@/lib/data/search";
import { getCountries } from "@/lib/data/catalog";
import { AppHeader } from "@/components/site/app-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrackButton } from "@/components/applications/track-button";

export const metadata = { title: "Search — GlobalGrad" };

const LEVELS: DegreeLevel[] = ["BACHELORS", "MASTERS", "PHD"];
const label = (s: string) =>
  s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const selectCls =
  "h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; level?: string; country?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const sp = await searchParams;
  const level = LEVELS.includes(sp.level as DegreeLevel)
    ? (sp.level as DegreeLevel)
    : undefined;

  const [countries, results] = await Promise.all([
    getCountries(),
    searchCatalog({ q: sp.q, level, country: sp.country || undefined }),
  ]);

  const searched = Boolean(sp.q || level || sp.country);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <SearchIcon className="h-6 w-6 text-primary" /> Search
          </h1>
          <p className="mt-1 text-muted-foreground">
            Find programs and scholarships by keyword, level and country.
          </p>
        </div>

        <form method="get" className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <Input
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="e.g. computer science, MIT, scholarship…"
            />
          </div>
          <select name="level" defaultValue={sp.level ?? ""} className={selectCls}>
            <option value="">Any level</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {label(l)}
              </option>
            ))}
          </select>
          <select
            name="country"
            defaultValue={sp.country ?? ""}
            className={selectCls}
          >
            <option value="">Any country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <Button type="submit">Search</Button>
        </form>

        {searched && (
          <>
            <section>
              <h2 className="mb-3 text-xl font-semibold">
                Programs{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({results.programs.length})
                </span>
              </h2>
              {results.programs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No programs match your search.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {results.programs.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl border border-border/60 bg-card/40 p-4"
                    >
                      <p className="font-medium">{p.university}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.programName}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {p.field} · {label(p.level)}
                        {p.country ? ` · ${p.country}` : ""}
                        {p.tuitionUsd
                          ? ` · ~$${p.tuitionUsd.toLocaleString()}/yr`
                          : ""}
                      </p>
                      <div className="mt-3">
                        <TrackButton programId={p.id} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {results.scholarships.length > 0 && (
              <section>
                <h2 className="mb-3 text-xl font-semibold">
                  Scholarships{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({results.scholarships.length})
                  </span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {results.scholarships.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-xl border border-border/60 bg-card/40 p-4"
                    >
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {s.provider}
                        {s.amountUsd
                          ? ` · ~$${s.amountUsd.toLocaleString()}`
                          : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
