-- CreateTable
CREATE TABLE "AnonymizedApplicant" (
    "id" TEXT NOT NULL,
    "cgpa" DOUBLE PRECISION NOT NULL,
    "ielts" DOUBLE PRECISION NOT NULL,
    "researchPapers" INTEGER NOT NULL DEFAULT 0,
    "targetField" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "targetLevel" "DegreeLevel" NOT NULL DEFAULT 'MASTERS',

    CONSTRAINT "AnonymizedApplicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicantOutcome" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "program" TEXT,
    "admitted" BOOLEAN NOT NULL,
    "scholarship" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ApplicantOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnonymizedApplicant_targetField_idx" ON "AnonymizedApplicant"("targetField");

-- CreateIndex
CREATE INDEX "ApplicantOutcome_applicantId_idx" ON "ApplicantOutcome"("applicantId");

-- AddForeignKey
ALTER TABLE "ApplicantOutcome" ADD CONSTRAINT "ApplicantOutcome_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "AnonymizedApplicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
