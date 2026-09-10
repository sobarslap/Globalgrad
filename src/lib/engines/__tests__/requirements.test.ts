import { describe, it, expect } from "vitest";
import {
  diffRequirements,
  summarizeDiffs,
  requirementLabel,
  type Requirements,
} from "../requirements";

const base: Requirements = {
  minCgpa: 3.0,
  minIelts: 6.5,
  admitCgpa: 3.6,
  admitIelts: 7.0,
};

describe("diffRequirements", () => {
  it("returns no diffs when nothing changes", () => {
    expect(diffRequirements(base, {})).toEqual([]);
    expect(diffRequirements(base, { minIelts: 6.5 })).toEqual([]);
  });

  it("detects a single changed field", () => {
    const d = diffRequirements(base, { minIelts: 7.0 });
    expect(d).toHaveLength(1);
    expect(d[0]).toEqual({ field: "minIelts", oldValue: 6.5, newValue: 7.0 });
  });

  it("detects multiple changed fields, ignoring unchanged ones", () => {
    const d = diffRequirements(base, { minCgpa: 3.2, minIelts: 6.5, admitCgpa: 3.8 });
    expect(d.map((x) => x.field).sort()).toEqual(["admitCgpa", "minCgpa"]);
  });

  it("ignores floating-point noise below epsilon", () => {
    expect(diffRequirements(base, { minCgpa: 3.0 + 1e-9 })).toEqual([]);
  });

  it("summarizes diffs in a readable line", () => {
    const d = diffRequirements(base, { minIelts: 7.0 });
    expect(summarizeDiffs(d)).toBe("Min IELTS 6.5 → 7");
  });

  it("labels fields", () => {
    expect(requirementLabel("admitCgpa")).toBe("Avg admit CGPA");
  });
});
