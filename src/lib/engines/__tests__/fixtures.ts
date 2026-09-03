import type { Program, Scholarship, StudentProfile } from "@/lib/domain/types";

/** A solid-but-not-elite applicant used across engine tests. */
export const baseStudent: StudentProfile = {
  cgpa: 3.5,
  ielts: 7.0,
  researchPapers: 1,
  workExperienceMonths: 12,
  targetLevel: "masters",
  targetField: "Computer Science",
  nationality: "Bangladesh",
};

export const eliteProgram: Program = {
  id: "mit-cs",
  university: "MIT",
  programName: "MSc Computer Science",
  field: "Computer Science",
  level: "masters",
  selectivity: 98,
  minCgpa: 3.5,
  minIelts: 7.0,
  admitCgpa: 3.9,
  admitIelts: 7.5,
  valuesResearch: true,
};

export const midProgram: Program = {
  id: "tum-cs",
  university: "TU Munich",
  programName: "MSc Informatics",
  field: "Computer Science",
  level: "masters",
  selectivity: 60,
  minCgpa: 3.0,
  minIelts: 6.5,
  admitCgpa: 3.4,
  admitIelts: 6.8,
  valuesResearch: false,
};

export const safeProgram: Program = {
  id: "regional-cs",
  university: "Regional State University",
  programName: "MSc Computing",
  field: "Computer Science",
  level: "masters",
  selectivity: 25,
  minCgpa: 2.5,
  minIelts: 6.0,
  admitCgpa: 3.0,
  admitIelts: 6.2,
  valuesResearch: false,
};

export const openScholarship: Scholarship = {
  id: "merit-global",
  name: "Global Merit Award",
  provider: "GlobalGrad Foundation",
  eligibleNationalities: [],
  eligibleFields: [],
  eligibleLevels: ["masters", "phd"],
  minCgpa: 3.0,
  minIelts: 6.5,
  meritCgpa: 3.7,
  valuesResearch: true,
};

export const restrictedScholarship: Scholarship = {
  id: "eu-only",
  name: "EU Excellence Grant",
  provider: "EU Commission",
  eligibleNationalities: ["Germany", "France", "Spain"],
  eligibleFields: ["Computer Science"],
  eligibleLevels: ["masters"],
  minCgpa: 3.2,
  minIelts: 6.5,
  meritCgpa: 3.8,
  valuesResearch: false,
};
