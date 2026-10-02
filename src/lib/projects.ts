import type { Project } from "@/types/portfolio";

/**
 * The index. Six plates, oversized numbers — the spine of the page.
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
    slug: "kolfly",
    index: "02",
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
    index: "03",
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
    index: "04",
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
    index: "05",
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
    index: "06",
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
