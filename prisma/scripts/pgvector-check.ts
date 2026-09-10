import { PrismaClient, Prisma } from "@prisma/client";
const db = new PrismaClient();

const lit = (v: number[]) => `[${v.join(",")}]`;

async function main() {
  // Grab one source, give it a deterministic 768-d test embedding.
  const one = await db.insightSource.findFirst({ select: { id: true, title: true } });
  if (!one) { console.log("no sources"); return; }
  const vec = Array.from({ length: 768 }, (_, i) => (i === 0 ? 1 : 0));
  await db.$executeRaw`UPDATE "InsightSource" SET "embedding" = ${lit(vec)}::vector WHERE "id" = ${one.id}`;

  // Similarity query ordered by cosine distance to the same vector.
  const rows = await db.$queryRaw<Array<{ id: string; title: string; dist: number }>>(Prisma.sql`
    SELECT "id", "title", ("embedding" <=> ${lit(vec)}::vector) AS dist
    FROM "InsightSource"
    WHERE "embedding" IS NOT NULL
    ORDER BY "embedding" <=> ${lit(vec)}::vector
    LIMIT 3`);
  console.log("nearest:", rows.map((r) => ({ title: r.title, dist: Number(r.dist) })));

  // Cleanup so the real backfill re-embeds this row properly.
  await db.$executeRaw`UPDATE "InsightSource" SET "embedding" = NULL WHERE "id" = ${one.id}`;
  console.log("pgvector OK (distance 0 to itself expected)");
}
main().catch((e) => { console.error("PGVECTOR CHECK FAILED:", e?.message ?? e); process.exit(1); })
  .finally(() => db.$disconnect());
