import { PrismaClient, DegreeLevel } from "@prisma/client";
import { realPrograms } from "./data/programs.real";
import { realScholarships } from "./data/scholarships.real";
import { realCountries } from "./data/countries.real";
import { hashPassword } from "../src/lib/password";

const db = new PrismaClient();

/** Map the lowercase level strings in the data files to the Prisma enum. */
const levelMap: Record<string, DegreeLevel> = {
  bachelors: DegreeLevel.BACHELORS,
  masters: DegreeLevel.MASTERS,
  phd: DegreeLevel.PHD,
};

const daysFromNow = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

async function main() {
  // Idempotent + non-destructive on the catalog: universities and programs are
  // upserted by natural key so their ids (and any student's Applications, which
  // FK to Program) are preserved. Only tables with no user-data FK are rebuilt.
  await db.deadline.deleteMany();
  await db.scholarship.deleteMany();

  // ---------- Countries (real macro data) ----------
  const countryIds = new Map<string, string>(); // code -> id
  const countryIdByName = new Map<string, string>(); // name -> id
  for (const c of realCountries) {
    const created = await db.country.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
    countryIds.set(c.code, created.id);
    countryIdByName.set(c.name, created.id);
  }

  // ---------- Universities + Programs (curated real catalog) ----------
  const universityIds = new Map<string, string>(); // name -> id
  for (const p of realPrograms) {
    let uniId = universityIds.get(p.university);
    if (!uniId) {
      const uniData = {
        name: p.university,
        countryId: countryIdByName.get(p.country),
        city: p.city,
        worldRank: p.worldRank,
        latitude: p.lat,
        longitude: p.lng,
        published: true,
      };
      const existing = await db.university.findFirst({
        where: { name: p.university },
        select: { id: true },
      });
      const uni = existing
        ? await db.university.update({ where: { id: existing.id }, data: uniData })
        : await db.university.create({ data: uniData });
      uniId = uni.id;
      universityIds.set(p.university, uniId);
    }

    const programData = {
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
      tuitionUsd: p.tuitionUsd,
      minGre: p.minGre ?? null,
      admitGre: p.admitGre ?? null,
      intake: p.intake ?? null,
      applicationUrl: p.applicationUrl ?? null,
      published: true,
    };
    const existingProgram = await db.program.findFirst({
      where: { universityId: uniId, programName: p.programName },
      select: { id: true },
    });
    const created = existingProgram
      ? await db.program.update({ where: { id: existingProgram.id }, data: programData })
      : await db.program.create({ data: programData });

    // A staggered application deadline for each program (future dates).
    const daysOut = 30 + (realPrograms.indexOf(p) % 6) * 25;
    await db.deadline.create({
      data: {
        title: `${p.university} — ${p.programName} application deadline`,
        dueDate: daysFromNow(daysOut),
        programId: created.id,
      },
    });
  }

  // ---------- Scholarships (curated real, with rich filter fields) ----------
  for (const s of realScholarships) {
    const scholarship = await db.scholarship.create({
      data: {
        name: s.name,
        provider: s.provider,
        countryId: countryIdByName.get(s.hostCountry) ?? null,
        eligibleNationalities: s.eligibleNationalities,
        eligibleFields: s.eligibleFields,
        eligibleLevels: s.eligibleLevels.map((l) => levelMap[l]),
        minCgpa: s.minCgpa,
        minIelts: s.minIelts,
        meritCgpa: s.meritCgpa,
        valuesResearch: s.valuesResearch,
        amountUsd: s.amountUsd,
        funding: s.funding,
        coverage: s.coverage,
        needBased: s.needBased,
        meritBased: s.meritBased,
        renewable: s.renewable,
        noAppFee: s.noAppFee,
        livingAllowance: s.livingAllowance,
        deadlineAt: daysFromNow(s.deadlineInDays),
        applicationUrl: s.applicationUrl,
        hostCountries: s.hostCountries,
        published: true,
      },
    });
    // A matching Deadline row so the calendar/feed surfaces it too.
    await db.deadline.create({
      data: {
        title: `${s.name} — scholarship deadline`,
        dueDate: daysFromNow(s.deadlineInDays),
        scholarshipId: scholarship.id,
      },
    });
  }

  // ---------- Clear any legacy synthetic applicant data ----------
  // The Similar Student Finder was removed to keep the site free of fabricated
  // outcomes (no real public dataset exists for anonymized applicant results).
  await db.applicantOutcome.deleteMany();
  await db.anonymizedApplicant.deleteMany();

  // ---------- Curated public-insight sources (Public Insight Engine) ----------
  await db.insightSource.deleteMany();
  const insightSources = [
    { title: "US F-1 visa interview tips", url: "https://travel.state.gov/", sourceType: "EMBASSY" as const, country: "United States", topic: "Visa", snippet: "Applicants are frequently asked about funding and ties to their home country; clear, consistent proof of finances and study intent matters more than memorized answers." },
    { title: "Reddit: Boston housing as a grad student", url: "https://www.reddit.com/r/gradadmissions/", sourceType: "FORUM" as const, country: "United States", topic: "Housing", snippet: "Students repeatedly warn that Boston-area rent can exceed tuition; many recommend securing housing or roommates months before arrival." },
    { title: "Canada study permit financial proof", url: "https://www.canada.ca/", sourceType: "EMBASSY" as const, country: "Canada", topic: "Visa", snippet: "A Guaranteed Investment Certificate plus first-year tuition is the most reliable way to satisfy proof-of-funds; incomplete funds are a common refusal reason." },
    { title: "Canada Post-Graduation Work Permit (PGWP)", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html", sourceType: "FAQ" as const, country: "Canada", topic: "Work", snippet: "The Post-Graduation Work Permit is a major draw; eligibility depends on your institution and program, so confirm your program qualifies before enrolling." },
    { title: "UK 28-day funds rule explained", url: "https://www.gov.uk/student-visa", sourceType: "FAQ" as const, country: "United Kingdom", topic: "Visa", snippet: "Maintenance funds must sit in your account for 28 consecutive days ending within 31 days of applying; dipping below the threshold restarts the clock." },
    { title: "Forum: cost of living in London", url: "https://www.thestudentroom.co.uk/", sourceType: "FORUM" as const, country: "United Kingdom", topic: "Cost", snippet: "London students stress budgeting for the Immigration Health Surcharge and high rent; outside London is noticeably cheaper." },
    { title: "Germany blocked account guide", url: "https://www.germany.info/", sourceType: "FAQ" as const, country: "Germany", topic: "Funding", snippet: "A blocked account (Sperrkonto) is standard proof of funds; set it up early because processing and embassy appointments can take weeks." },
    { title: "Study in Germany: tuition & costs (DAAD)", url: "https://www.daad.de/en/study-and-research-in-germany/plan-your-studies/tuition-fees/", sourceType: "FAQ" as const, country: "Germany", topic: "Cost", snippet: "Most public universities charge little or no tuition, but budget for semester contributions, mandatory health insurance, and competitive housing." },
    { title: "Australia Genuine Student requirement", url: "https://immi.homeaffairs.gov.au/", sourceType: "EMBASSY" as const, country: "Australia", topic: "Visa", snippet: "The Genuine Student statement and evidence of finances are central; weak or generic statements are a frequent cause of delays." },
    { title: "Working while studying in Australia (Study Australia)", url: "https://www.studyaustralia.gov.au/", sourceType: "FAQ" as const, country: "Australia", topic: "Work", snippet: "Work hours are capped during term (with limited exceptions); OSHC health cover is mandatory for the length of your visa." },
  ];
  for (const s of insightSources) {
    await db.insightSource.create({ data: { ...s, published: true } });
  }

  // ---------- Demo student (one-click "Try the demo account") ----------
  // Password comes from DEMO_USER_PASSWORD so nothing sensitive is committed;
  // the signInAsDemo server action reads the same env, keeping them in sync.
  const demoEmail = "demo@globalgrad.app";
  const demoPassword = process.env.DEMO_USER_PASSWORD || "DemoStudent#2026";
  const passwordHash = await hashPassword(demoPassword);
  const demoUser = await db.user.upsert({
    where: { email: demoEmail },
    update: { passwordHash, emailVerified: new Date(), role: "STUDENT" },
    create: {
      email: demoEmail,
      name: "Demo Student",
      passwordHash,
      emailVerified: new Date(),
      role: "STUDENT",
    },
  });
  await db.studentProfile.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      cgpa: 3.2,
      ielts: 6.5,
      researchPapers: 1,
      workExperienceMonths: 14,
      targetLevel: "MASTERS",
      targetField: "Computer Science",
      nationality: "Bangladesh",
      greTotal: 312,
      budgetUsd: 30000,
    },
  });

  const [u, p, sch, c] = await Promise.all([
    db.university.count(),
    db.program.count(),
    db.scholarship.count(),
    db.country.count(),
  ]);
  console.log(
    `Seeded: ${c} countries, ${u} universities, ${p} programs, ${sch} scholarships, 1 demo student.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
