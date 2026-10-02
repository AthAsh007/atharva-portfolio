import type { NavItem, Profile, ToolkitGroup } from "@/types/portfolio";

export const nav: NavItem[] = [
  { label: "Work", href: "#index" },
  { label: "What I do", href: "#capabilities" },
  { label: "About", href: "#approach" },
  { label: "Let's talk", href: "#contact" },
];

export const profile: Profile = {
  name: "Atharva Ashtekar",
  shortName: "Atharva",
  roles: ["AI / ML Engineer", "Automation & Agents", "Product Engineer", "Founder"],
  statement:
    "I build AI systems, automation and the products around them: agent and workflow pipelines, the ledger underneath, and the interface people use.",
  bio: [
    "I build the whole product, not one layer of it. Most of what I ship starts as a rough idea and ends as a running system: the retrieval and agent layer, the API and data model under it, deployment, and the front end people use.",
    "Automation runs through most of it. Agent and workflow pipelines in n8n and TypeScript that wire systems together, keep a human on the steps that matter, and remove the manual middle of a process.",
    "That range is deliberate. AI products fail in the seams: between the model and the data, between the prototype and the version that survives real users. Owning both ends keeps those seams from becoming someone else's problem.",
    "I work as a software engineer at Manexus and ship my own products under Tenzro. That work covers distributed ledgers, multi-tenant SaaS, automation, and applied AI research tooling.",
  ],
  location: "India, working remotely",
  email: "athatharva2002@gmail.com",
  availability: "Available for new work",
  booking: "https://calendly.com/athatharva2002/30min",
  socials: [
    { label: "GitHub", handle: "@AthAsh007", href: "https://github.com/AthAsh007" },
    { label: "LinkedIn", handle: "in/atharva-ashtekar", href: "https://www.linkedin.com/in/atharva-ashtekar-315288240/" },
    { label: "n8n", handle: "@athash007", href: "https://n8n.io/creators/athash007/" },
    { label: "Discord", handle: "deadass_x", href: "deadass_x" },
    { label: "WhatsApp", handle: "+91 95189 70722", href: "https://wa.me/919518970722" },
    { label: "Telegram", handle: "@DeadAss007", href: "https://t.me/DeadAss007" },
    { label: "Email", handle: "athatharva2002@gmail.com", href: "mailto:athatharva2002@gmail.com" },
  ],
};

/** The working toolkit, grouped for the carousel: one card per lane. */
export const toolkit: ToolkitGroup[] = [
  { group: "Languages", items: ["TypeScript", "Python", "Go", "Daml"] },
  {
    group: "AI and agents",
    items: ["LLM agents", "RAG / ChromaDB", "Claude API", "Evals", "Prompt architecture"],
  },
  { group: "Automation", items: ["n8n", "Workflow automation", "Webhooks", "API integrations"] },
  {
    group: "Product",
    items: ["React 19", "Next.js 15", "Tailwind CSS", "FastAPI", "PostgreSQL", "Stripe"],
  },
  { group: "Infra", items: ["Turborepo", "Cloudflare", "gRPC", "Playwright", "Three.js / XR"] },
];
