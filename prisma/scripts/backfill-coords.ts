/**
 * One-off backfill: set latitude/longitude on existing Country and University
 * rows in place (added in the map_coordinates migration). Safe to re-run —
 * it only updates rows matched by name and never deletes anything.
 *
 *   npx tsx prisma/scripts/backfill-coords.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const countries: Record<string, { lat: number; lng: number }> = {
  "United States": { lat: 39.8, lng: -98.6 },
  Canada: { lat: 56.1, lng: -106.3 },
  "United Kingdom": { lat: 55.4, lng: -3.4 },
  Germany: { lat: 51.2, lng: 10.4 },
  Australia: { lat: -25.3, lng: 133.8 },
  Switzerland: { lat: 46.8, lng: 8.2 },
  Sweden: { lat: 60.1, lng: 18.6 },
};

const universities: Record<string, { city: string; lat: number; lng: number }> = {
  MIT: { city: "Cambridge, MA", lat: 42.3601, lng: -71.0942 },
  "ETH Zurich": { city: "Zurich", lat: 47.3763, lng: 8.5476 },
  "TU Munich": { city: "Munich", lat: 48.1497, lng: 11.5679 },
  "University of Waterloo": { city: "Waterloo, ON", lat: 43.4723, lng: -80.5449 },
  "University of Alberta": { city: "Edmonton, AB", lat: 53.5232, lng: -113.5263 },
  "Monash University": { city: "Melbourne", lat: -37.9105, lng: 145.1345 },
  "Chalmers University": { city: "Gothenburg", lat: 57.689, lng: 11.9746 },
  "Regional State University": { city: "Lincoln, NE", lat: 40.8, lng: -96.7 },
};

async function main() {
  let c = 0;
  for (const [name, { lat, lng }] of Object.entries(countries)) {
    const r = await db.country.updateMany({ where: { name }, data: { latitude: lat, longitude: lng } });
    c += r.count;
  }
  let u = 0;
  for (const [name, { city, lat, lng }] of Object.entries(universities)) {
    const r = await db.university.updateMany({
      where: { name },
      data: { latitude: lat, longitude: lng, city },
    });
    u += r.count;
  }
  console.log(`Backfilled ${c} countries, ${u} universities with coordinates.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
