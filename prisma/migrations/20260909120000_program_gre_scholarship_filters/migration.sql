-- CreateEnum
CREATE TYPE "ScholarshipFunding" AS ENUM ('FULLY_FUNDED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "Coverage" AS ENUM ('FULL', 'MAJOR', 'PARTIAL');

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "admitGre" INTEGER,
ADD COLUMN     "applicationUrl" TEXT,
ADD COLUMN     "intake" TEXT,
ADD COLUMN     "minGre" INTEGER;

-- AlterTable
ALTER TABLE "Scholarship" ADD COLUMN     "applicationUrl" TEXT,
ADD COLUMN     "coverage" "Coverage" NOT NULL DEFAULT 'PARTIAL',
ADD COLUMN     "deadlineAt" TIMESTAMP(3),
ADD COLUMN     "funding" "ScholarshipFunding" NOT NULL DEFAULT 'PARTIAL',
ADD COLUMN     "hostCountries" TEXT[],
ADD COLUMN     "livingAllowance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meritBased" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "needBased" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "noAppFee" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "renewable" BOOLEAN NOT NULL DEFAULT false;

