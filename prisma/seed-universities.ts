/**
 * University catalog seed. Two idempotent steps:
 *  1) upsert 10 more popular study-abroad destinations (with real macro data so
 *     they slot into the Country Decision Dashboard), and
 *  2) import the REAL university list for all target countries from the open
 *     Hipolabs dataset into `CatalogUniversity` (name, city, website).
 *
 * Re-runnable: countries upsert by unique code; universities are createMany with
 * skipDuplicates against the (name, countryCode) unique key. Run with:
 *   npx tsx prisma/seed-universities.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// 10 additional popular destinations. Macro figures are representative
// real-world values (post-study work months, rough monthly student living
// cost USD, cost-of-living index vs US=100, part-time work rules, currency).
const NEW_COUNTRIES = [
  { name: "Japan", code: "JP", flagEmoji: "🇯🇵", postStudyWorkMonths: 12, monthlyLivingCostUsd: 1000, costOfLivingIndex: 83, partTimeAllowed: true, workHoursPerWeek: 28, currency: "JPY", latitude: 36.2, longitude: 138.3 },
  { name: "South Korea", code: "KR", flagEmoji: "🇰🇷", postStudyWorkMonths: 24, monthlyLivingCostUsd: 900, costOfLivingIndex: 77, partTimeAllowed: true, workHoursPerWeek: 20, currency: "KRW", latitude: 36.5, longitude: 127.8 },
  { name: "China", code: "CN", flagEmoji: "🇨🇳", postStudyWorkMonths: 12, monthlyLivingCostUsd: 700, costOfLivingIndex: 45, partTimeAllowed: false, workHoursPerWeek: 0, currency: "CNY", latitude: 35.8, longitude: 104.2 },
  { name: "Italy", code: "IT", flagEmoji: "🇮🇹", postStudyWorkMonths: 12, monthlyLivingCostUsd: 950, costOfLivingIndex: 67, partTimeAllowed: true, workHoursPerWeek: 20, currency: "EUR", latitude: 41.9, longitude: 12.6 },
  { name: "Spain", code: "ES", flagEmoji: "🇪🇸", postStudyWorkMonths: 12, monthlyLivingCostUsd: 900, costOfLivingIndex: 55, partTimeAllowed: true, workHoursPerWeek: 30, currency: "EUR", latitude: 40.4, longitude: -3.7 },
  { name: "Denmark", code: "DK", flagEmoji: "🇩🇰", postStudyWorkMonths: 36, monthlyLivingCostUsd: 1300, costOfLivingIndex: 85, partTimeAllowed: true, workHoursPerWeek: 20, currency: "DKK", latitude: 56.0, longitude: 10.0 },
  { name: "Norway", code: "NO", flagEmoji: "🇳🇴", postStudyWorkMonths: 12, monthlyLivingCostUsd: 1400, costOfLivingIndex: 90, partTimeAllowed: true, workHoursPerWeek: 20, currency: "NOK", latitude: 60.5, longitude: 8.5 },
  { name: "Finland", code: "FI", flagEmoji: "🇫🇮", postStudyWorkMonths: 24, monthlyLivingCostUsd: 1000, costOfLivingIndex: 72, partTimeAllowed: true, workHoursPerWeek: 30, currency: "EUR", latitude: 61.9, longitude: 25.7 },
  { name: "Belgium", code: "BE", flagEmoji: "🇧🇪", postStudyWorkMonths: 12, monthlyLivingCostUsd: 1000, costOfLivingIndex: 68, partTimeAllowed: true, workHoursPerWeek: 20, currency: "EUR", latitude: 50.5, longitude: 4.5 },
  { name: "Austria", code: "AT", flagEmoji: "🇦🇹", postStudyWorkMonths: 12, monthlyLivingCostUsd: 1050, costOfLivingIndex: 70, partTimeAllowed: true, workHoursPerWeek: 20, currency: "EUR", latitude: 47.6, longitude: 14.5 },
];

// All destinations we import universities for: the 12 already seeded + the 10
// above. Keyed by ISO alpha-2 (Hipolabs' `alpha_two_code`) → display name.
const TARGETS: Record<string, string> = {
  US: "United States", GB: "United Kingdom", CA: "Canada", AU: "Australia",
  DE: "Germany", NL: "Netherlands", SE: "Sweden", CH: "Switzerland",
  SG: "Singapore", IE: "Ireland", FR: "France", NZ: "New Zealand",
  JP: "Japan", KR: "South Korea", CN: "China", IT: "Italy", ES: "Spain",
  DK: "Denmark", NO: "Norway", FI: "Finland", BE: "Belgium", AT: "Austria",
};

const HIPOLABS_URL =
  "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";

type HipoEntry = {
  name: string;
  country: string;
  alpha_two_code: string;
  "state-province": string | null;
  web_pages: string[];
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  // 1) Countries.
  for (const c of NEW_COUNTRIES) {
    await db.country.upsert({ where: { code: c.code }, update: c, create: c });
  }
  console.log(`Upserted ${NEW_COUNTRIES.length} countries.`);

  // 2) Universities from the open Hipolabs dataset.
  console.log("Fetching Hipolabs dataset…");
  const res = await fetch(HIPOLABS_URL);
  if (!res.ok) throw new Error(`Hipolabs fetch failed: ${res.status}`);
  const all = (await res.json()) as HipoEntry[];
  console.log(`Dataset has ${all.length} universities worldwide.`);

  let inserted = 0;
  for (const [code, display] of Object.entries(TARGETS)) {
    const rows = all.filter((u) => u.alpha_two_code === code);
    // Dedupe by name within the country (dataset has occasional repeats).
    const seen = new Set<string>();
    const data = rows
      .filter((u) => {
        const key = u.name.trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return Boolean(u.name?.trim());
      })
      .map((u) => ({
        name: u.name.trim(),
        country: display,
        countryCode: code,
        city: u["state-province"]?.trim() || null,
        website: u.web_pages?.[0] ?? null,
      }));

    let countryInserted = 0;
    for (const batch of chunk(data, 500)) {
      const r = await db.catalogUniversity.createMany({
        data: batch,
        skipDuplicates: true,
      });
      countryInserted += r.count;
    }
    inserted += countryInserted;
    console.log(`  ${display} (${code}): ${data.length} in dataset, +${countryInserted} new`);
  }

  const total = await db.catalogUniversity.count();
  console.log(`Done. Inserted ${inserted} new; catalog now holds ${total}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
