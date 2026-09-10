/**
 * University Reality Check (Module 3, F2): practical, widely-reported context
 * that official pages downplay — cost of living, housing pressure, part-time
 * work, and language.
 *
 * These are QUALITATIVE, general indicators drawn from broadly-known public
 * information about each city/institution — not precise per-university scores.
 * Always verify with current students, official pages, and city cost data.
 */
export type RealityLevel = "low" | "moderate" | "high";

export interface RealityCheck {
  university: string;
  city: string;
  housingPressure: RealityLevel; // high = hard to find / expensive
  partTimeAvailability: RealityLevel; // high = plentiful (good)
  languageBarrier: RealityLevel; // high = significant
  costOfLiving: RealityLevel; // high = expensive
  hiddenCosts: string;
  watchOut: string;
}

export const REALITY_CHECKS: RealityCheck[] = [
  {
    university: "Massachusetts Institute of Technology",
    city: "Cambridge / Boston, USA",
    housingPressure: "high",
    partTimeAvailability: "moderate",
    languageBarrier: "low",
    costOfLiving: "high",
    hiddenCosts: "Boston-area rent is very high; US health insurance and student fees add up fast.",
    watchOut: "Cost of living can dwarf tuition — budget aggressively for housing.",
  },
  {
    university: "ETH Zurich",
    city: "Zurich, Switzerland",
    housingPressure: "high",
    partTimeAvailability: "low",
    languageBarrier: "moderate",
    costOfLiving: "high",
    hiddenCosts: "Zurich is one of the world's most expensive cities; deposits are steep.",
    watchOut: "Secure housing early — waitlists are long and rents are brutal.",
  },
  {
    university: "Technical University of Munich",
    city: "Munich, Germany",
    housingPressure: "high",
    partTimeAvailability: "moderate",
    languageBarrier: "moderate",
    costOfLiving: "moderate",
    hiddenCosts: "Semester contribution, broadcast (Rundfunk) fee, and rental deposits.",
    watchOut: "Munich housing is tight; some German helps for part-time roles.",
  },
  {
    university: "University of Waterloo",
    city: "Waterloo, Canada",
    housingPressure: "moderate",
    partTimeAvailability: "high",
    languageBarrier: "low",
    costOfLiving: "moderate",
    hiddenCosts: "Co-op fees and winter gear; intercity travel for internships.",
    watchOut: "Strong co-op culture — plan work terms; housing spikes near campus.",
  },
  {
    university: "University of Alberta",
    city: "Edmonton, Canada",
    housingPressure: "low",
    partTimeAvailability: "high",
    languageBarrier: "low",
    costOfLiving: "moderate",
    hiddenCosts: "Winter clothing and heating; a car is often helpful.",
    watchOut: "Very cold winters — factor comfort and transport costs.",
  },
  {
    university: "Monash University",
    city: "Melbourne, Australia",
    housingPressure: "moderate",
    partTimeAvailability: "high",
    languageBarrier: "low",
    costOfLiving: "high",
    hiddenCosts: "OSHC health cover, and higher grocery and transport costs.",
    watchOut: "Melbourne rents are rising; part-time hours are capped during term.",
  },
  {
    university: "Chalmers University of Technology",
    city: "Gothenburg, Sweden",
    housingPressure: "high",
    partTimeAvailability: "low",
    languageBarrier: "low",
    costOfLiving: "high",
    hiddenCosts: "Student-union membership; groceries and eating out are pricey.",
    watchOut: "Gothenburg housing queues are long — apply the moment you're admitted.",
  },
];
