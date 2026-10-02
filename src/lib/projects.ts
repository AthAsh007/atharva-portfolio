import type { Project } from "@/types/portfolio";
import { profile } from "@/lib/site";

/** The n8n creator profile, reused by the Automations card. */
const n8n = profile.socials.find((s) => s.label.toLowerCase() === "n8n");

/**
 * The index. Eight plates, oversized numbers, the spine of the page.
 * Ordered by weight, not by date.
 */
export const projects: Project[] = [
  {
    slug: "tenzro",
    index: "01",
    title: "Tenzro Network",
    kicker: "Distributed ledger infrastructure",
    year: "2025 to now",
    role: "Founder / Engineer",
    summary:
      "Ledger infrastructure and a self-custody wallet built on the Canton privacy-preserving network.",
    detail:
      "Network services and wallet clients around a privacy-preserving distributed ledger: key management, transaction construction and settlement flows, with the contract layer written in Daml so that who-sees-what is enforced by the ledger rather than by an application check.",
    stack: ["Daml", "Canton", "TypeScript", "Node.js"],
    plate: "ledger",
  },
  {
    slug: "automations",
    index: "02",
    title: "Automations",
    kicker: "Workflow automation suite",
    year: "2025 to now",
    role: "Automation Engineer",
    summary:
      "Agent and workflow pipelines in n8n and TypeScript that remove the manual steps between systems.",
    detail:
      "Agent and workflow pipelines wired across real business systems. A LinkedIn engine turns post comments into classified, personalised outreach, and an auto publishing pipeline researches a topic, drafts long form copy with an LLM and schedules it to client sites. Every workflow ships with retries, fallbacks and idempotency keys, holding roughly 98% completion across 3,000+ monthly executions with no double sends.",
    stack: ["n8n", "TypeScript", "LLM APIs", "PostgreSQL", "Webhooks"],
    href: n8n?.href,
    linkLabel: "n8n profile",
    plate: "flow",
  },
  {
    slug: "kolektiva",
    index: "03",
    title: "Kolektiva",
    kicker: "RWA fractional property platform",
    year: "2024 to 2025",
    role: "Engineer",
    summary:
      "A real-world asset platform that tokenises property for fractional on-chain ownership.",
    detail:
      "ERC standard tokenisation contracts that split a property into fractional, tradeable ownership. Investor onboarding, KYC gating and the full offering lifecycle run end to end, covering primary issuance and secondary transfers with on-chain ownership tracking and secure transaction flows. Eight properties onboarded.",
    stack: ["Solidity", "Ethereum", "Web3.js", "Next.js", "Node.js"],
    plate: "fraction",
  },
  {
    slug: "kolfly",
    index: "04",
    title: "Kolfly",
    kicker: "Multi-tenant AI SaaS",
    year: "2025",
    role: "Product Engineer",
    summary:
      "A multi-workspace, AI-powered B2B platform for influencer marketing, from discovery through to billing.",
    detail:
      "KOL discovery and database management, AI-assisted campaign strategy and content generation, publishing, analytics, and usage-based billing, all under multi-tenant workspaces with team collaboration. Enterprise capability at a price SMBs can actually clear. Shipped with an admin panel and a separate backend service.",
    stack: ["Next.js", "TypeScript", "LLM pipelines", "PostgreSQL", "Stripe"],
    plate: "grid",
  },
  {
    slug: "ai-tutor",
    index: "05",
    title: "AI Tutor",
    kicker: "Applied AI research artifact",
    year: "2025",
    role: "Engineer",
    summary:
      "An LLM classroom tutor with three avatar modes, built as the usable artifact for a research study.",
    detail:
      "A locally deployable, open-source tutoring platform implementing three interaction modes (plain text, a real-time deepfake avatar of the lecturer, and a neutral 3D mascot) so the research could isolate what avatar representation actually does to a learning experience. Built to be run by a department, not a lab machine.",
    stack: ["Python", "LLM orchestration", "Real-time avatars", "WebRTC"],
    plate: "orbit",
  },
  {
    slug: "redesign-pipeline",
    index: "06",
    title: "AI Website Redesign Pipeline",
    kicker: "Agentic tooling",
    year: "2025",
    role: "Founder / Engineer",
    summary:
      "A human-in-the-loop pipeline that scrapes a site, generates redesigns, and exports a real Next.js project.",
    detail:
      "Three steps, a human between each: crawl and extract a live site's palette, type and content; generate standalone redesigns pinned to its real brand across a 100-template design system; then render approved designs to desktop/mobile PNGs and PDF, and export a deployable Next.js project as a zip. Runs entirely local: no cloud, no database, no execution of generated code.",
    stack: ["Next.js 15", "Playwright", "Claude API", "TypeScript"],
    plate: "stack",
  },
  {
    slug: "wmti",
    index: "07",
    title: "WMTI",
    kicker: "Polyglot platform",
    year: "2026",
    role: "Architect / Engineer",
    summary:
      "A Turborepo monorepo running three services in three languages behind one shared type contract.",
    detail:
      "A TanStack Start front end, a Go API on Fiber and gRPC, and a Python FastAPI service that generates quizzes over a vector store, deployed as a Cloudflare Container. Shared TypeScript config, lint rules and packages keep three runtimes honest with each other instead of drifting apart.",
    stack: ["Turborepo", "React 19", "Go / Fiber / gRPC", "FastAPI", "ChromaDB", "Cloudflare"],
    plate: "mesh",
  },
  {
    slug: "canton-experiments",
    index: "08",
    title: "Canton Experiments",
    kicker: "Open pattern library",
    year: "2025",
    role: "Author",
    summary:
      "A library of self-contained Daml contracts, each isolating one distributed-ledger pattern.",
    detail:
      "Seven independent projects (bank, property, IOU, marketplace, auction, escrow) each compiling and running on its own, so a pattern can be picked up without wading through the rest. Covers signatory/observer separation, contract keys, atomic delivery-versus-payment, time-gated choices and multi-party propose-accept workflows. Targets Daml SDK 3.4 on the Canton 3 line.",
    stack: ["Daml", "Canton 3", "Daml-LF 2.x"],
    plate: "wave",
  },
];
