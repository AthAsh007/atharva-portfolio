import type { NavItem, Profile } from "@/types/portfolio";

export const nav: NavItem[] = [
  { label: "Index", href: "#index" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Approach", href: "#approach" },
  { label: "Contact", href: "#contact" },
];

export const profile: Profile = {
  name: "Atharva Ashtekar",
  shortName: "Atharva",
  roles: ["AI / ML Engineer", "Product Engineer", "Founder"],
  statement:
    "I build AI systems and the products they live inside: model and agent plumbing, the ledger underneath, and the interface someone actually uses.",
  bio: [
    "I work end to end. Most of what I ship starts as an unproven idea and ends as a running system: the retrieval and agent layer, the API and data model underneath it, the deployment story, and the front end that makes the whole thing feel obvious.",
    "That range is deliberate. AI products fail in the seams: between the model and the data, between the prototype and the thing that survives real users. Owning both ends is how I keep those seams from being someone else's problem.",
    "I currently build as a software engineer at Manexus and on my own products under Tenzro, spanning distributed ledger infrastructure, multi-tenant SaaS, and applied AI research tooling.",
  ],
  location: "India, working remotely",
  email: "team@tenzro.com",
  availability: "Open to select projects",
  socials: [
    { label: "GitHub", handle: "@AthAsh007", href: "https://github.com/AthAsh007" },
    { label: "Email", handle: "team@tenzro.com", href: "mailto:team@tenzro.com" },
  ],
};

/** Marquee band — the working toolkit, not a skills-bar. */
export const toolkit: string[] = [
  "TypeScript",
  "React 19",
  "Next.js 15",
  "Python",
  "FastAPI",
  "Go",
  "gRPC",
  "Daml / Canton",
  "Anthropic Claude API",
  "LLM agents",
  "RAG / ChromaDB",
  "Playwright",
  "PostgreSQL",
  "Turborepo",
  "Cloudflare",
  "Stripe",
  "Tailwind CSS",
  "Three.js / XR",
];
