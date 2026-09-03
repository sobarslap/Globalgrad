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

  // Countries
  const countryIds = new Map<string, string>();
  for (const { name, code } of Object.values(universityCountry)) {
    if (countryIds.has(code)) continue;
    const c = await db.country.create({
      data: { name, code, partTimeAllowed: true },
    });
    countryIds.set(code, c.id);
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
    await db.program.create({
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
        published: true,
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
        published: true,
      },
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
