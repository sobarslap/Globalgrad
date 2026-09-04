/**
 * University Reality Check (Module 3, F2): practical info official pages downplay.
 * Ratings are 1–5. Illustrative/curated — verify with current students and forums.
 */
export interface RealityCheck {
  university: string;
  housingDifficulty: number; // 1 easy … 5 very hard
  partTimeAvailability: number; // 1 scarce … 5 plentiful
  languageBarrier: number; // 1 none … 5 significant
  studentSatisfaction: number; // 1 low … 5 high
  hiddenCosts: string;
  watchOut: string;
}

export const REALITY_CHECKS: RealityCheck[] = [
  {
    university: "MIT",
    housingDifficulty: 5,
    partTimeAvailability: 3,
    languageBarrier: 1,
    studentSatisfaction: 5,
    hiddenCosts: "Boston rent is very high; health insurance and fees add up fast.",
    watchOut: "Cost of living can dwarf tuition — budget aggressively for housing.",
  },
  {
    university: "ETH Zurich",
    housingDifficulty: 5,
    partTimeAvailability: 2,
    languageBarrier: 3,
    studentSatisfaction: 5,
    hiddenCosts: "Zurich is one of the world's most expensive cities; deposits are steep.",
    watchOut: "Secure housing early — waitlists are long and rents are brutal.",
  },
  {
    university: "TU Munich",
    housingDifficulty: 4,
    partTimeAvailability: 4,
    languageBarrier: 3,
    studentSatisfaction: 4,
    hiddenCosts: "Semester contribution, Rundfunk fee, and rental deposits.",
    watchOut: "Munich housing is tight; some German helps for part-time roles.",
  },
  {
    university: "University of Waterloo",
    housingDifficulty: 3,
    partTimeAvailability: 4,
    languageBarrier: 1,
    studentSatisfaction: 4,
    hiddenCosts: "Co-op fees and winter gear; intercity travel for internships.",
    watchOut: "Strong co-op culture — plan work terms; housing spikes near campus.",
  },
  {
    university: "University of Alberta",
    housingDifficulty: 2,
    partTimeAvailability: 4,
    languageBarrier: 1,
    studentSatisfaction: 4,
    hiddenCosts: "Winter clothing and heating; car often helpful.",
    watchOut: "Very cold winters — factor comfort and transport costs.",
  },
  {
    university: "Monash University",
    housingDifficulty: 3,
    partTimeAvailability: 4,
    languageBarrier: 1,
    studentSatisfaction: 4,
    hiddenCosts: "OSHC health cover and higher grocery/transport costs.",
    watchOut: "Melbourne rents rising; part-time capped during term.",
  },
  {
    university: "Chalmers University",
    housingDifficulty: 4,
    partTimeAvailability: 2,
    languageBarrier: 2,
    studentSatisfaction: 4,
    hiddenCosts: "Student union membership; pricey groceries and eating out.",
    watchOut: "Gothenburg housing queues are long — apply the moment you're admitted.",
  },
  {
    university: "Regional State University",
    housingDifficulty: 2,
    partTimeAvailability: 3,
    languageBarrier: 1,
    studentSatisfaction: 3,
    hiddenCosts: "Campus fees and textbooks; limited public transport.",
    watchOut: "Fewer big-employer internships nearby — plan for relocation.",
  },
];
