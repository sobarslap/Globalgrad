/**
 * Calendar/timeline helpers (C4). Pure grouping + day-math so the view logic is
 * testable without a DB or the DOM.
 */

export interface CalendarItem {
  id: string;
  title: string;
  date: Date;
  kind: "deadline" | "status";
  meta?: string;
}

export interface MonthGroup {
  key: string; // "2026-09"
  label: string; // "September 2026"
  items: CalendarItem[];
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthKey(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${y}-${m}`;
}

export function monthLabel(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Whole days from `now` until `date` (negative = past). */
export function daysUntil(date: Date, now: Date = new Date()): number {
  const ms = new Date(date).getTime() - now.getTime();
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

/** Group items into ascending months, items within a month sorted by date. */
export function groupByMonth(items: CalendarItem[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();
  for (const item of items) {
    const key = monthKey(item.date);
    let group = map.get(key);
    if (!group) {
      group = { key, label: monthLabel(item.date), items: [] };
      map.set(key, group);
    }
    group.items.push(item);
  }
  const groups = [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
  for (const g of groups) {
    g.items.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  return groups;
}
