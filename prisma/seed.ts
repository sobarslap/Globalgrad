import { PrismaClient, DegreeLevel } from "@prisma/client";
import { samplePrograms, sampleScholarships } from "../src/lib/data/sample";
import { hashPassword } from "../src/lib/password";

const db = new PrismaClient();

/** Map the engine's lowercase level strings to the Prisma enum. */
const levelMap: Record<string, DegreeLevel> = {
  bachelors: DegreeLevel.BACHELORS,
  masters: DegreeLevel.MASTERS,
  phd: DegreeLevel.PHD,
};

// Rough country assignment for the sample universities (illustrative).
const universityCountry: Record<string, { name: string; code: string }> = {
  MIT: { name: "United States", code: "US" },
  "ETH Zurich": { name: "Switzerland", code: "CH" },
  "TU Munich": { name: "Germany", code: "DE" },
  "University of Waterloo": { name: "Canada", code: "CA" },
  "University of Alberta": { name: "Canada", code: "CA" },
  "Monash University": { name: "Australia", code: "AU" },
  "Chalmers University": { name: "Sweden", code: "SE" },
  "Regional State University": { name: "United States", code: "US" },
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
    { name: "United States", code: "US", flagEmoji: "🇺🇸", postStudyWorkMonths: 12, monthlyLivingCostUsd: 1500, costOfLivingIndex: 100, partTimeAllowed: true, workHoursPerWeek: 20, currency: "USD" },
    { name: "Canada", code: "CA", flagEmoji: "🇨🇦", postStudyWorkMonths: 36, monthlyLivingCostUsd: 1200, costOfLivingIndex: 72, partTimeAllowed: true, workHoursPerWeek: 24, currency: "CAD" },
    { name: "United Kingdom", code: "GB", flagEmoji: "🇬🇧", postStudyWorkMonths: 24, monthlyLivingCostUsd: 1400, costOfLivingIndex: 78, partTimeAllowed: true, workHoursPerWeek: 20, currency: "GBP" },
    { name: "Germany", code: "DE", flagEmoji: "🇩🇪", postStudyWorkMonths: 18, monthlyLivingCostUsd: 1100, costOfLivingIndex: 70, partTimeAllowed: true, workHoursPerWeek: 20, currency: "EUR" },
    { name: "Australia", code: "AU", flagEmoji: "🇦🇺", postStudyWorkMonths: 24, monthlyLivingCostUsd: 1600, costOfLivingIndex: 83, partTimeAllowed: true, workHoursPerWeek: 24, currency: "AUD" },
    { name: "Switzerland", code: "CH", flagEmoji: "🇨🇭", postStudyWorkMonths: 6, monthlyLivingCostUsd: 2000, costOfLivingIndex: 122, partTimeAllowed: true, workHoursPerWeek: 15, currency: "CHF" },
    { name: "Sweden", code: "SE", flagEmoji: "🇸🇪", postStudyWorkMonths: 12, monthlyLivingCostUsd: 1000, costOfLivingIndex: 74, partTimeAllowed: true, workHoursPerWeek: 40, currency: "SEK" },
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

  // Staff accounts for role-gated dashboards (dev only).
  const staff = [
    { email: "admin@globalgrad.dev", name: "Platform Admin", role: "ADMIN" as const, password: "Admin1234" },
    { email: "manager@globalgrad.dev", name: "Content Manager", role: "CONTENT_MANAGER" as const, password: "Manager1234" },
  ];
  for (const s of staff) {
    const passwordHash = await hashPassword(s.password);
    await db.user.upsert({
      where: { email: s.email },
      update: { role: s.role, name: s.name, passwordHash },
      create: { email: s.email, name: s.name, role: s.role, passwordHash },
    });
  }

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
