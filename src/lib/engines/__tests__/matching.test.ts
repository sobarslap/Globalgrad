import { describe, it, expect } from "vitest";
import { matchPrograms, buildStrategy } from "@/lib/engines/matching";
import { baseStudent, eliteProgram, midProgram, safeProgram } from "./fixtures";

const programs = [eliteProgram, midProgram, safeProgram];

describe("matchPrograms", () => {
  it("places every program in exactly one bucket", () => {
    const r = matchPrograms(baseStudent, programs);
    const total = r.safe.length + r.target.length + r.reach.length;
    expect(total).toBe(programs.length);
    expect(r.all).toHaveLength(programs.length);
  });

  it("sorts each bucket by score descending", () => {
    const r = matchPrograms(baseStudent, programs);
    for (const bucket of [r.safe, r.target, r.reach, r.all]) {
      const scores = bucket.map((m) => m.score);
      const sorted = [...scores].sort((a, b) => b - a);
      expect(scores).toEqual(sorted);
    }
  });

  it("puts the easiest program ahead of the elite one overall", () => {
    const r = matchPrograms(baseStudent, programs);
    const ids = r.all.map((m) => m.program.id);
    expect(ids.indexOf("regional-cs")).toBeLessThan(ids.indexOf("mit-cs"));
  });
});

describe("buildStrategy", () => {
  it("respects requested counts when enough options exist", () => {
    const many = [
      safeProgram,
      { ...safeProgram, id: "s2" },
      { ...safeProgram, id: "s3" },
      { ...safeProgram, id: "s4" },
    ];
    const r = matchPrograms(baseStudent, many);
    const plan = buildStrategy(r, { safe: 3, target: 0, reach: 0 });
    expect(plan.safe).toHaveLength(3);
    expect(plan.total).toBe(3);
  });

  it("degrades gracefully and notes shortfalls", () => {
    const r = matchPrograms(baseStudent, [safeProgram]);
    const plan = buildStrategy(r);
    expect(plan.total).toBeLessThan(9);
    expect(plan.note).toMatch(/adjusted/i);
  });
});
