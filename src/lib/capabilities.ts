import type { Capability, Metric, Principle } from "@/types/portfolio";

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
    title: "Automation",
    body: "Agent and workflow automation, mostly in n8n and TypeScript: webhooks, scheduled jobs, API integrations and approvals. I am an n8n verified creator, so the workflows run on a platform I know end to end.",
    tags: ["n8n", "Agents", "Webhooks", "API integrations", "Human in the loop"],
    badge: "n8n verified creator",
  },
  {
    index: "D",
    title: "Ledger & Web3",
    body: "Privacy-preserving distributed ledger work in Daml on Canton. Contracts where confidentiality and settlement are properties of the ledger, not of the app on top.",
    tags: ["Daml", "Canton", "Smart contracts", "Wallets"],
  },
  {
    index: "E",
    title: "Zero to one",
    body: "Taking an idea from a paragraph to a running system with users on it, including the unglamorous middle where most prototypes quietly die.",
    tags: ["Architecture", "Prototyping", "Founding engineering"],
  },
];

/** How I work: three positions, used by the Approach band. */
export const principles: Principle[] = [
  {
    index: "01",
    title: "Own both ends",
    body: "The model and the data, the API and the interface. Keeping both ends in one pair of hands stops the seams from becoming someone else's problem.",
  },
  {
    index: "02",
    title: "Automate the middle",
    body: "The manual steps between systems are where time leaks. Agent and workflow pipelines remove them, with a human left on the calls that matter.",
  },
  {
    index: "03",
    title: "Build for real users",
    body: "A prototype is the start, not the finish. I build the version that survives real inputs, real load and real people.",
  },
];

export const metrics: Metric[] = [
  { value: "Zero to one", label: "Products carried from an idea to production" },
  { value: "Polyglot", label: "Languages running in production" },
  { value: "Published", label: "Research artifact behind a published study" },
  { value: "Solo", label: "Full-stack ownership" },
];
