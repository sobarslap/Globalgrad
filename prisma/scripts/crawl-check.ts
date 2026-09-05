import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const crawled = await db.insightSource.findMany({
    where: { origin: "CRAWLED" },
    select: { title: true, country: true, published: true, snippet: true },
  });
  const withEmbedding = await db.$queryRaw<Array<{ n: bigint }>>`
    SELECT COUNT(*)::bigint AS n FROM "InsightSource" WHERE "origin"='CRAWLED' AND "embedding" IS NOT NULL`;
  console.log("CRAWLED sources:", crawled.map((c) => ({
    title: c.title.slice(0, 50), country: c.country, published: c.published,
    snippetPreview: c.snippet.slice(0, 80) + "…",
  })));
  console.log("crawled with embedding:", Number(withEmbedding[0].n));
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
