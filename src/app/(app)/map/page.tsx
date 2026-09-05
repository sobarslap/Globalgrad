import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMapUniversities } from "@/lib/data/map";
import { AppHeader } from "@/components/site/app-header";
import { UniversityMap } from "@/components/map/university-map";

export const metadata = { title: "University map — GlobalGrad" };

export default async function MapPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const universities = await getMapUniversities();

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-5xl space-y-6 px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">University map</h1>
          <p className="mt-1 text-muted-foreground">
            {universities.length} universities on the map — click a marker for
            location and program count. Tiles © OpenStreetMap contributors.
          </p>
        </div>
        {universities.length > 0 ? (
          <UniversityMap universities={universities} />
        ) : (
          <p className="rounded-xl border border-border/60 bg-muted/40 px-6 py-16 text-center text-muted-foreground">
            No universities with map coordinates yet.
          </p>
        )}
      </main>
    </div>
  );
}
