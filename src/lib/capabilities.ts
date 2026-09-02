import type { Capability, Metric } from "@/types/portfolio";

export const capabilities: Capability[] = [
  {
    index: "A",
    title: "AI systems",
    body: "Agents, retrieval and LLM pipelines built to survive contact with real inputs: evaluated, bounded, and cheap enough to run in production rather than in a demo.",
    tags: ["Agents", "RAG", "Evals", "Claude API", "Prompt architecture"],
  },
  {
    index: "B",
    title: "Product engineering",
    body: "The whole product, not a layer of it. Data model, API, front end and deploy, shipped as one coherent thing by one person who holds the entire picture.",
    tags: ["Next.js", "React", "Go", "FastAPI", "PostgreSQL"],
  },
  {
    index: "C",
    title: "Ledger & Web3",
    body: "Privacy-preserving distributed ledger work in Daml on Canton. Contracts where confidentiality and settlement are properties of the ledger, not of the app on top.",
    tags: ["Daml", "Canton", "Smart contracts", "Wallets"],
  },
  {
    index: "D",
    title: "Zero to one",
    body: "Taking an idea from a paragraph to a running system with users on it, including the unglamorous middle where most prototypes quietly die.",
    tags: ["Architecture", "Prototyping", "Founding engineering"],
  },
];

export const metrics: Metric[] = [
  { value: "6+", label: "Products shipped end to end" },
  { value: "4", label: "Languages in production" },
  { value: "1", label: "Research artifact behind a CHI paper" },
  { value: "100%", label: "Full-stack ownership" },
];
