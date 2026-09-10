/** Cost of Degree Calculator + Funding Gap Analyzer (Module 4, F1 & F2). Pure. */

export interface CostInputs {
  tuitionUsd: number;
  monthlyLivingUsd: number;
  months: number;
  visaFeeUsd: number;
  insuranceUsd: number;
  applicationFeeUsd: number;
  flightUsd: number;
  emergencyUsd: number;
}

export interface CostBreakdown {
  tuition: number;
  living: number;
  visa: number;
  insurance: number;
  application: number;
  flight: number;
  emergency: number;
  total: number;
}

export function computeCost(i: CostInputs): CostBreakdown {
  const tuition = Math.max(0, i.tuitionUsd);
  const living = Math.max(0, i.monthlyLivingUsd) * Math.max(0, i.months);
  const visa = Math.max(0, i.visaFeeUsd);
  const insurance = Math.max(0, i.insuranceUsd);
  const application = Math.max(0, i.applicationFeeUsd);
  const flight = Math.max(0, i.flightUsd);
  const emergency = Math.max(0, i.emergencyUsd);
  const total =
    tuition + living + visa + insurance + application + flight + emergency;
  return { tuition, living, visa, insurance, application, flight, emergency, total };
}

export interface FundingSuggestion {
  kind: "scholarship" | "cheaper-country" | "advice";
  label: string;
  detail: string;
  amountUsd?: number;
}

export interface FundingGapResult {
  totalCost: number;
  budget: number;
  /** Positive = shortfall, negative/zero = fully funded. */
  gap: number;
  coveredPct: number;
  suggestions: FundingSuggestion[];
}

export interface FundingContext {
  scholarships: { name: string; amountUsd?: number }[];
  cheaperCountries: { name: string; monthlyLivingUsd: number }[];
}

/**
 * Compare the student's budget with the estimated total cost. When there's a
 * gap, surface concrete ways to close it: matched scholarships, cheaper
 * countries, and general advice.
 */
export function analyzeFundingGap(
  totalCost: number,
  budget: number,
  ctx: FundingContext
): FundingGapResult {
  const gap = Math.max(0, Math.round(totalCost - budget));
  const coveredPct =
    totalCost > 0 ? Math.min(100, Math.round((budget / totalCost) * 100)) : 100;

  const suggestions: FundingSuggestion[] = [];
  if (gap > 0) {
    let remaining = gap;
    for (const s of ctx.scholarships.slice(0, 3)) {
      suggestions.push({
        kind: "scholarship",
        label: s.name,
        detail: s.amountUsd
          ? `Could cover about $${s.amountUsd.toLocaleString()} of your gap.`
          : "You match this scholarship — apply to reduce your gap.",
        amountUsd: s.amountUsd,
      });
      if (s.amountUsd) remaining -= s.amountUsd;
    }
    for (const c of ctx.cheaperCountries.slice(0, 2)) {
      suggestions.push({
        kind: "cheaper-country",
        label: `Consider ${c.name}`,
        detail: `Lower living cost (~$${c.monthlyLivingUsd.toLocaleString()}/mo) shrinks the total.`,
      });
    }
    suggestions.push({
      kind: "advice",
      label: remaining > 0 ? "Still a gap remaining" : "Gap likely closable",
      detail:
        remaining > 0
          ? `After the above, ~$${Math.max(0, Math.round(remaining)).toLocaleString()} may remain — consider part-time work, a lower-tuition program, or a partial-funding plan.`
          : "The suggestions above could fully close your funding gap.",
    });
  }

  return { totalCost, budget, gap, coveredPct, suggestions };
}
