-- CreateTable
CREATE TABLE "CrawlSource" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceType" "InsightSourceType" NOT NULL,
    "country" TEXT,
    "topic" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastCrawledAt" TIMESTAMP(3),
    "lastHash" TEXT,
    "lastStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrawlSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CrawlSource_url_key" ON "CrawlSource"("url");

-- CreateIndex
CREATE INDEX "CrawlSource_enabled_idx" ON "CrawlSource"("enabled");
