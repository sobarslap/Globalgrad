-- Enable pgvector for semantic retrieval (A1). Must precede the vector column.
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "InsightOrigin" AS ENUM ('CURATED', 'CRAWLED');

-- AlterTable
ALTER TABLE "InsightSource" ADD COLUMN     "contentHash" TEXT,
ADD COLUMN     "embedding" vector(768),
ADD COLUMN     "fetchedAt" TIMESTAMP(3),
ADD COLUMN     "origin" "InsightOrigin" NOT NULL DEFAULT 'CURATED';

-- CreateIndex
CREATE INDEX "InsightSource_origin_published_idx" ON "InsightSource"("origin", "published");
