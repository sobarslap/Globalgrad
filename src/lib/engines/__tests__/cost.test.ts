import { describe, it, expect } from "vitest";
import {
  computeCost,
  analyzeFundingGap,
  type CostInputs,
} from "@/lib/engines/cost";

const base: CostInputs = {
  tuitionUsd: 30000,
  monthlyLivingUsd: 1000,
  months: 24,
  visaFeeUsd: 200,
  insuranceUsd: 800,
  applicationFeeUsd: 100,
  flightUsd: 900,
  emergencyUsd: 2000,
};

describe("computeCost", () => {
  it("sums all components (living = monthly × months)", () => {
    const b = computeCost(base);
    expect(b.living).toBe(24000);
    expect(b.total).toBe(
      30000 + 24000 + 200 + 800 + 100 + 900 + 2000
    );
  });

  it("clamps negative inputs to zero", () => {
    const b = computeCost({ ...base, tuitionUsd: -5000, months: -3 });
    expect(b.tuition).toBe(0);
    expect(b.living).toBe(0);
  });
});

describe("analyzeFundingGap", () => {
  const ctx = {
    scholarships: [{ name: "A", amountUsd: 10000 }, { name: "B" }],
    cheaperCountries: [{ name: "Germany", monthlyLivingUsd: 900 }],
  };

  it("reports a shortfall when budget < cost, with suggestions", () => {
    const r = analyzeFundingGap(50000, 20000, ctx);
    expect(r.gap).toBe(30000);
    expect(r.coveredPct).toBe(40);
    expect(r.suggestions.length).toBeGreaterThan(0);
    expect(r.suggestions.some((s) => s.kind === "scholarship")).toBe(true);
  });

  it("reports fully funded when budget >= cost", () => {
    const r = analyzeFundingGap(20000, 25000, ctx);
    expect(r.gap).toBe(0);
    expect(r.coveredPct).toBe(100);
    expect(r.suggestions).toHaveLength(0);
  });

  it("never returns a negative gap", () => {
    const r = analyzeFundingGap(1000, 5000, ctx);
    expect(r.gap).toBeGreaterThanOrEqual(0);
  });
});
