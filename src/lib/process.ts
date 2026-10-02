import type { ProcessStep } from "@/types/portfolio";

/** How a project moves, as four stages. Automate sits in the middle. */
export const process: ProcessStep[] = [
  { index: "01", title: "Understand", steps: ["Requirements", "Constraints", "System design"] },
  { index: "02", title: "Automate", steps: ["APIs", "n8n", "Agents", "Webhooks"] },
  { index: "03", title: "Build", steps: ["Next.js", "TypeScript", "Backend", "Integrations"] },
  { index: "04", title: "Ship", steps: ["Deploy", "Monitor", "Iterate"] },
];
