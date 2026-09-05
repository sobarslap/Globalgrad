/**
 * Requirement-change detection (Module 2, F4). Pure diff over a program's
 * admission requirements — used by the Content Manager update action to record
 * changes and notify affected students.
 */

export const REQUIREMENT_FIELDS = [
  "minCgpa",
  "minIelts",
  "admitCgpa",
  "admitIelts",
] as const;

export type RequirementField = (typeof REQUIREMENT_FIELDS)[number];

export type Requirements = Record<RequirementField, number>;

export interface RequirementDiff {
  field: RequirementField;
  oldValue: number;
  newValue: number;
}

const LABELS: Record<RequirementField, string> = {
  minCgpa: "Min CGPA",
  minIelts: "Min IELTS",
  admitCgpa: "Avg admit CGPA",
  admitIelts: "Avg admit IELTS",
};

export function requirementLabel(field: RequirementField): string {
  return LABELS[field];
}

/**
 * Returns the fields whose value actually changed. Partial `next` is allowed —
 * fields left undefined are treated as unchanged. Uses a small epsilon so
 * floating-point noise (e.g. 6.5 vs 6.50000001) isn't reported as a change.
 */
export function diffRequirements(
  current: Requirements,
  next: Partial<Requirements>,
): RequirementDiff[] {
  const diffs: RequirementDiff[] = [];
  for (const field of REQUIREMENT_FIELDS) {
    const newValue = next[field];
    if (newValue === undefined) continue;
    const oldValue = current[field];
    if (Math.abs(newValue - oldValue) > 1e-6) {
      diffs.push({ field, oldValue, newValue });
    }
  }
  return diffs;
}

/** Human-readable one-line summary of a set of diffs. */
export function summarizeDiffs(diffs: RequirementDiff[]): string {
  return diffs
    .map((d) => `${requirementLabel(d.field)} ${d.oldValue} → ${d.newValue}`)
    .join(", ");
}
