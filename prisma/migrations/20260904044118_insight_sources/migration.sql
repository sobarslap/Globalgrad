-- CreateEnum
CREATE TYPE "InsightSourceType" AS ENUM ('FAQ', 'EMBASSY', 'BLOG', 'FORUM', 'YOUTUBE', 'NEWS');

-- CreateTable
CREATE TABLE "InsightSource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sourceType" "InsightSourceType" NOT NULL,
    "country" TEXT,
    "topic" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsightSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InsightSource_country_idx" ON "InsightSource"("country");
