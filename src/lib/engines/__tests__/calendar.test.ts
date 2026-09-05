import { describe, it, expect } from "vitest";
import {
  groupByMonth,
  monthKey,
  monthLabel,
  daysUntil,
  type CalendarItem,
} from "../calendar";

const mk = (id: string, iso: string): CalendarItem => ({
  id,
  title: id,
  date: new Date(iso),
  kind: "deadline",
});

describe("calendar helpers", () => {
  it("computes month key and label", () => {
    const d = new Date("2026-09-15T00:00:00Z");
    expect(monthKey(d)).toMatch(/^2026-09$/);
    expect(monthLabel(d)).toMatch(/2026/);
  });

  it("daysUntil is positive for future, negative for past", () => {
    const now = new Date("2026-09-01T00:00:00Z");
    expect(daysUntil(new Date("2026-09-11T00:00:00Z"), now)).toBe(10);
    expect(daysUntil(new Date("2026-08-30T00:00:00Z"), now)).toBeLessThan(0);
  });

  it("groups items by month in ascending order", () => {
    const groups = groupByMonth([
      mk("c", "2026-11-05T00:00:00Z"),
      mk("a", "2026-09-20T00:00:00Z"),
      mk("b", "2026-09-05T00:00:00Z"),
    ]);
    expect(groups.map((g) => g.key)).toEqual(["2026-09", "2026-11"]);
    // within September, earlier date first
    expect(groups[0].items.map((i) => i.id)).toEqual(["b", "a"]);
  });

  it("returns empty array for no items", () => {
    expect(groupByMonth([])).toEqual([]);
  });
});
