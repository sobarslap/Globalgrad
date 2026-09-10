import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const [countries, universities, programs, scholarships, applications, applicants, insights] =
    await Promise.all([
      db.country.count(),
      db.university.count(),
      db.program.count(),
      db.scholarship.count(),
      db.application.count(),
      db.anonymizedApplicant.count(),
      db.insightSource.count(),
    ]);
  console.log(
    JSON.stringify(
      { countries, universities, programs, scholarships, applications, applicants, insights },
      null,
      2
    )
  );
}
main().finally(() => db.$disconnect());
