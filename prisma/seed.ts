import { PrismaClient, DegreeLevel } from "@prisma/client";
import { samplePrograms, sampleScholarships } from "../src/lib/data/sample";

const db = new PrismaClient();

/** Map the engine's lowercase level strings to the Prisma enum. */
const levelMap: Record<string, DegreeLevel> = {
  bachelors: DegreeLevel.BACHELORS,
  masters: DegreeLevel.MASTERS,
  phd: DegreeLevel.PHD,
};

// Rough country assignment for the sample universities (illustrative).
// city + lat/lng are approximate campus locations used for the map view.
const universityCountry: Record<
  string,
  { name: string; code: string; city?: string; lat?: number; lng?: number }
> = {
  MIT: { name: "United States", code: "US", city: "Cambridge, MA", lat: 42.3601, lng: -71.0942 },
  "ETH Zurich": { name: "Switzerland", code: "CH", city: "Zurich", lat: 47.3763, lng: 8.5476 },
  "TU Munich": { name: "Germany", code: "DE", city: "Munich", lat: 48.1497, lng: 11.5679 },
  "University of Waterloo": { name: "Canada", code: "CA", city: "Waterloo, ON", lat: 43.4723, lng: -80.5449 },
  "University of Alberta": { name: "Canada", code: "CA", city: "Edmonton, AB", lat: 53.5232, lng: -113.5263 },
  "Monash University": { name: "Australia", code: "AU", city: "Melbourne", lat: -37.9105, lng: 145.1345 },
  "Chalmers University": { name: "Sweden", code: "SE", city: "Gothenburg", lat: 57.689, lng: 11.9746 },
  "Regional State University": { name: "United States", code: "US", city: "Lincoln, NE", lat: 40.8, lng: -96.7 },
};

async function main() {
  // Idempotent: clear domain tables (order respects FKs).
  await db.deadline.deleteMany();
  await db.program.deleteMany();
  await db.university.deleteMany();
  await db.scholarship.deleteMany();
  await db.country.deleteMany();

  // Countries — macro data is illustrative (verify against official sources).
  const countryData = [
    { name: "United States", code: "US", flagEmoji: "🇺🇸", postStudyWorkMonths: 12, monthlyLivingCostUsd: 1500, costOfLivingIndex: 100, partTimeAllowed: true, workHoursPerWeek: 20, currency: "USD", latitude: 39.8, longitude: -98.6 },
    { name: "Canada", code: "CA", flagEmoji: "🇨🇦", postStudyWorkMonths: 36, monthlyLivingCostUsd: 1200, costOfLivingIndex: 72, partTimeAllowed: true, workHoursPerWeek: 24, currency: "CAD", latitude: 56.1, longitude: -106.3 },
    { name: "United Kingdom", code: "GB", flagEmoji: "🇬🇧", postStudyWorkMonths: 24, monthlyLivingCostUsd: 1400, costOfLivingIndex: 78, partTimeAllowed: true, workHoursPerWeek: 20, currency: "GBP", latitude: 55.4, longitude: -3.4 },
    { name: "Germany", code: "DE", flagEmoji: "🇩🇪", postStudyWorkMonths: 18, monthlyLivingCostUsd: 1100, costOfLivingIndex: 70, partTimeAllowed: true, workHoursPerWeek: 20, currency: "EUR", latitude: 51.2, longitude: 10.4 },
    { name: "Australia", code: "AU", flagEmoji: "🇦🇺", postStudyWorkMonths: 24, monthlyLivingCostUsd: 1600, costOfLivingIndex: 83, partTimeAllowed: true, workHoursPerWeek: 24, currency: "AUD", latitude: -25.3, longitude: 133.8 },
    { name: "Switzerland", code: "CH", flagEmoji: "🇨🇭", postStudyWorkMonths: 6, monthlyLivingCostUsd: 2000, costOfLivingIndex: 122, partTimeAllowed: true, workHoursPerWeek: 15, currency: "CHF", latitude: 46.8, longitude: 8.2 },
    { name: "Sweden", code: "SE", flagEmoji: "🇸🇪", postStudyWorkMonths: 12, monthlyLivingCostUsd: 1000, costOfLivingIndex: 74, partTimeAllowed: true, workHoursPerWeek: 40, currency: "SEK", latitude: 60.1, longitude: 18.6 },
  ];
  const countryIds = new Map<string, string>();
  for (const c of countryData) {
    const created = await db.country.create({ data: c });
    countryIds.set(c.code, created.id);
  }

  // Universities + programs
  const universityIds = new Map<string, string>();
  for (const p of samplePrograms) {
    let uniId = universityIds.get(p.university);
    if (!uniId) {
      const meta = universityCountry[p.university];
      const uni = await db.university.create({
        data: {
          name: p.university,
          countryId: meta ? countryIds.get(meta.code) : undefined,
          city: meta?.city,
          latitude: meta?.lat,
          longitude: meta?.lng,
          published: true,
        },
      });
      uniId = uni.id;
      universityIds.set(p.university, uniId);
    }
    const created = await db.program.create({
      data: {
        universityId: uniId,
        programName: p.programName,
        field: p.field,
        level: levelMap[p.level],
        selectivity: p.selectivity,
        minCgpa: p.minCgpa,
        minIelts: p.minIelts,
        admitCgpa: p.admitCgpa,
        admitIelts: p.admitIelts,
        valuesResearch: p.valuesResearch,
        // Rough annual tuition scaled by selectivity (illustrative).
        tuitionUsd: Math.round(8000 + p.selectivity * 380),
        published: true,
      },
    });
    // A staggered application deadline for each program (future dates).
    const daysOut = 30 + (samplePrograms.indexOf(p) % 6) * 25;
    await db.deadline.create({
      data: {
        title: `${p.university} — application deadline`,
        dueDate: new Date(Date.now() + daysOut * 24 * 60 * 60 * 1000),
        programId: created.id,
      },
    });
  }

  // Scholarships
  for (const s of sampleScholarships) {
    await db.scholarship.create({
      data: {
        name: s.name,
        provider: s.provider,
        eligibleNationalities: s.eligibleNationalities,
        eligibleFields: s.eligibleFields,
        eligibleLevels: s.eligibleLevels.map((l) => levelMap[l]),
        minCgpa: s.minCgpa,
        minIelts: s.minIelts,
        meritCgpa: s.meritCgpa,
        valuesResearch: s.valuesResearch,
        amountUsd: 10000 + Math.round(s.meritCgpa * 5000), // illustrative award
        published: true,
      },
    });
  }

  // Anonymized past applicants (Similar Student Finder) — synthetic but plausible.
  await db.applicantOutcome.deleteMany();
  await db.anonymizedApplicant.deleteMany();
  const unis = [
    "MIT",
    "ETH Zurich",
    "TU Munich",
    "University of Waterloo",
    "University of Alberta",
    "Monash University",
    "Chalmers University",
    "Regional State University",
  ];
  const nats = ["Bangladesh", "India", "Pakistan", "Nigeria", "Nepal"];
  const rng = (n: number) => Math.floor(Math.random() * n);
  for (let i = 0; i < 20; i++) {
    const cgpa = Math.round((2.8 + Math.random() * 1.1) * 100) / 100; // 2.8–3.9
    const ielts = Math.round((6.0 + Math.random() * 1.5) * 2) / 2; // 6.0–7.5
    const research = rng(4);
    // Strength drives admit/scholarship odds.
    const strength = (cgpa - 2.8) / 1.1 + (ielts - 6) / 1.5 + research / 3;
    const picks = [...unis].sort(() => Math.random() - 0.5).slice(0, 2 + rng(3));
    await db.anonymizedApplicant.create({
      data: {
        cgpa,
        ielts,
        researchPapers: research,
        targetField: "Computer Science",
        nationality: nats[rng(nats.length)],
        outcomes: {
          create: picks.map((u) => {
            const elitePenalty = /MIT|ETH|Waterloo/.test(u) ? 1.2 : 0.4;
            const admitted = strength - elitePenalty + Math.random() * 0.6 > 0.2;
            return {
              university: u,
              program: "MSc Computer Science",
              admitted,
              scholarship: admitted && Math.random() < 0.35,
            };
          }),
        },
      },
    });
  }

  // Curated public-insight sources (paraphrased; Public Insight Engine).
  await db.insightSource.deleteMany();
  const insightSources = [
    { title: "US F-1 visa interview tips", url: "https://travel.state.gov/", sourceType: "EMBASSY" as const, country: "United States", topic: "Visa", snippet: "Applicants are frequently asked about funding and ties to their home country; clear, consistent proof of finances and study intent matters more than memorized answers." },
    { title: "Reddit: Boston housing as a grad student", url: "https://www.reddit.com/r/gradadmissions/", sourceType: "FORUM" as const, country: "United States", topic: "Housing", snippet: "Students repeatedly warn that Boston-area rent can exceed tuition; many recommend securing housing or roommates months before arrival." },
    { title: "Canada study permit financial proof", url: "https://www.canada.ca/", sourceType: "EMBASSY" as const, country: "Canada", topic: "Visa", snippet: "A Guaranteed Investment Certificate plus first-year tuition is the most reliable way to satisfy proof-of-funds; incomplete funds are a common refusal reason." },
    { title: "Blog: PGWP and working in Canada", url: "https://example-studyblog.com/canada-pgwp", sourceType: "BLOG" as const, country: "Canada", topic: "Work", snippet: "The Post-Graduation Work Permit is a major draw; students advise choosing programs and institutions that keep you eligible." },
    { title: "UK 28-day funds rule explained", url: "https://www.gov.uk/student-visa", sourceType: "FAQ" as const, country: "United Kingdom", topic: "Visa", snippet: "Maintenance funds must sit in your account for 28 consecutive days ending within 31 days of applying; dipping below the threshold restarts the clock." },
    { title: "Forum: cost of living in London", url: "https://www.thestudentroom.co.uk/", sourceType: "FORUM" as const, country: "United Kingdom", topic: "Cost", snippet: "London students stress budgeting for the Immigration Health Surcharge and high rent; outside London is noticeably cheaper." },
    { title: "Germany blocked account guide", url: "https://www.germany.info/", sourceType: "FAQ" as const, country: "Germany", topic: "Funding", snippet: "A blocked account (Sperrkonto) is standard proof of funds; set it up early because processing and embassy appointments can take weeks." },
    { title: "YouTube transcript: studying in Germany on a budget", url: "https://youtube.com/", sourceType: "YOUTUBE" as const, country: "Germany", topic: "Cost", snippet: "Creators highlight low or no tuition at public universities, but note semester contributions, health insurance, and competitive housing." },
    { title: "Australia Genuine Student requirement", url: "https://immi.homeaffairs.gov.au/", sourceType: "EMBASSY" as const, country: "Australia", topic: "Visa", snippet: "The Genuine Student statement and evidence of finances are central; weak or generic statements are a frequent cause of delays." },
    { title: "Forum: part-time work limits in Australia", url: "https://www.reddit.com/r/australia/", sourceType: "FORUM" as const, country: "Australia", topic: "Work", snippet: "Students note part-time hours are capped during term; OSHC health cover is mandatory and easy to forget." },
    { title: "General: SOP mistakes to avoid", url: "https://example-studyblog.com/sop", sourceType: "BLOG" as const, country: null, topic: "Applications", snippet: "Admissions readers say vague, one-size-fits-all statements of purpose hurt the most; specific fit with faculty and program stands out." },
    { title: "General: scholarship timing", url: "https://example-studyblog.com/scholarships", sourceType: "BLOG" as const, country: null, topic: "Funding", snippet: "Many funding deadlines fall before or with admission deadlines; applicants who wait until after an offer often miss the best scholarships." },
  ];
  for (const s of insightSources) {
    await db.insightSource.create({ data: { ...s, published: true } });
  }

  // NOTE: staff (Admin / Content Manager) accounts are intentionally NOT seeded.
  // Never hardcode credentials in a committed file. Assign roles from the Admin
  // dashboard (or the maintenance script) instead.

  const [u, p, sch, c] = await Promise.all([
    db.university.count(),
    db.program.count(),
    db.scholarship.count(),
    db.country.count(),
  ]);
  console.log(
    `Seeded: ${c} countries, ${u} universities, ${p} programs, ${sch} scholarships.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
