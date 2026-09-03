import { z } from "zod";

/** Validation schema for the student profile form (React Hook Form + Zod). */
export const studentProfileSchema = z.object({
  cgpa: z.coerce
    .number()
    .min(0, "CGPA can't be negative")
    .max(4, "Use a 4.0 scale"),
  ielts: z.coerce
    .number()
    .min(0, "IELTS can't be negative")
    .max(9, "IELTS max is 9.0"),
  researchPapers: z.coerce
    .number()
    .int("Whole number")
    .min(0)
    .max(50),
  workExperienceMonths: z.coerce
    .number()
    .int("Whole number of months")
    .min(0)
    .max(600),
  targetLevel: z.enum(["bachelors", "masters", "phd"]),
  targetField: z.string().min(2, "Enter your field of study"),
  nationality: z.string().min(2, "Enter your nationality"),
  greTotal: z.coerce.number().min(260).max(340).optional().or(z.literal("").transform(() => undefined)),
});

export type StudentProfileInput = z.input<typeof studentProfileSchema>;
export type StudentProfileValues = z.output<typeof studentProfileSchema>;
