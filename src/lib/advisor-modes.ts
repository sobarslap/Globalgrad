/**
 * Advisor focus modes — shared by the client chat UI and the server-only
 * advisor context. Kept in its own module (no `server-only`) so the client
 * component can import the mode list without pulling in server code.
 */
export type AdvisorMode = "general" | "fit" | "countries" | "visa" | "roadmap";

export const ADVISOR_MODES: { value: AdvisorMode; label: string; emoji: string }[] = [
  { value: "general", label: "Ask anything", emoji: "💬" },
  { value: "fit", label: "Explain university fit", emoji: "🎓" },
  { value: "countries", label: "Compare countries", emoji: "🌍" },
  { value: "visa", label: "Visa & public insights", emoji: "📄" },
  { value: "roadmap", label: "Next-steps roadmap", emoji: "🚀" },
];

export const MODE_GUIDANCE: Record<AdvisorMode, string> = {
  general: "Answer the student's question directly using the data below.",
  fit: "Focus on WHY specific programs are Safe/Target/Reach for this student, citing the readiness reasons.",
  countries: "Compare the student's best-fit countries on cost, post-study work, and part-time work rights.",
  visa: "Summarize visa readiness and proof-of-funds expectations for the student's top countries; flag what to verify officially.",
  roadmap: "Give a short, prioritized list of the student's immediate next steps toward applying.",
};

export function normalizeMode(m: unknown): AdvisorMode {
  return ADVISOR_MODES.some((x) => x.value === m) ? (m as AdvisorMode) : "general";
}
