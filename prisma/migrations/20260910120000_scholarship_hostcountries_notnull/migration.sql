-- Enforce the non-nullable contract for Scholarship.hostCountries.
-- Backfill any legacy NULLs (rows created before the column existed), then add a
-- default and the NOT NULL constraint so the DB matches prisma/schema.prisma.
UPDATE "Scholarship" SET "hostCountries" = ARRAY[]::text[] WHERE "hostCountries" IS NULL;
ALTER TABLE "Scholarship" ALTER COLUMN "hostCountries" SET DEFAULT ARRAY[]::text[];
ALTER TABLE "Scholarship" ALTER COLUMN "hostCountries" SET NOT NULL;
