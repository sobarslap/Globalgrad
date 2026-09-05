import { PrismaClient, InsightSourceType } from "@prisma/client";
const db = new PrismaClient();

/**
 * Whitelisted, mostly-static OFFICIAL pages for the Public Insight crawler (A1).
 * Kept intentionally small and ToS-friendly (government / official info pages).
 * Idempotent: upsert by url.
 */
const CRAWL_SOURCES = [
  { url: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html", title: "US Student Visa — U.S. Department of State", sourceType: InsightSourceType.EMBASSY, country: "United States", topic: "Visa" },
  { url: "https://www.gov.uk/student-visa", title: "UK Student visa — GOV.UK", sourceType: InsightSourceType.FAQ, country: "United Kingdom", topic: "Visa" },
  { url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500", title: "Australia Student visa (subclass 500)", sourceType: InsightSourceType.EMBASSY, country: "Australia", topic: "Visa" },
  { url: "https://www.make-it-in-germany.com/en/studying-in-germany/requirements", title: "Studying in Germany — requirements", sourceType: InsightSourceType.FAQ, country: "Germany", topic: "Applications" },
  { url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html", title: "Study permit — Canada.ca", sourceType: InsightSourceType.EMBASSY, country: "Canada", topic: "Visa" },
];

async function main() {
  for (const s of CRAWL_SOURCES) {
    await db.crawlSource.upsert({
      where: { url: s.url },
      update: { title: s.title, sourceType: s.sourceType, country: s.country, topic: s.topic, enabled: true },
      create: s,
    });
  }
  const n = await db.crawlSource.count();
  console.log(`Seeded crawl sources. Total enabled/known: ${n}`);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
