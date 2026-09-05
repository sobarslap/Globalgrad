import { db } from "@/lib/db";

export interface MapUniversity {
  id: string;
  name: string;
  city: string | null;
  countryName: string | null;
  flagEmoji: string | null;
  latitude: number;
  longitude: number;
  programCount: number;
}

/**
 * Published universities that have coordinates, for the map view.
 * Universities without lat/lng are simply omitted.
 */
export async function getMapUniversities(): Promise<MapUniversity[]> {
  const rows = await db.university.findMany({
    where: {
      published: true,
      latitude: { not: null },
      longitude: { not: null },
    },
    include: {
      country: { select: { name: true, flagEmoji: true } },
      _count: { select: { programs: { where: { published: true } } } },
    },
    orderBy: { name: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    city: r.city,
    countryName: r.country?.name ?? null,
    flagEmoji: r.country?.flagEmoji ?? null,
    latitude: r.latitude as number,
    longitude: r.longitude as number,
    programCount: r._count.programs,
  }));
}
