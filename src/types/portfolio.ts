/** Shared domain types for the portfolio. Consumed by src/lib/* and rendered by components. */

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
}

export interface Profile {
  name: string;
  shortName: string;
  roles: string[];
  /** One-line positioning statement used in the hero. */
  statement: string;
  /** Two or three paragraphs for the about band. */
  bio: string[];
  location: string;
  email: string;
  availability: string;
  /** Calendly-style booking link for a 30-min call. */
  booking: string;
  socials: SocialLink[];
}

export interface Project {
  /** Stable slug — also the anchor id. */
  slug: string;
  /** Zero-padded plate number, e.g. "01". */
  index: string;
  title: string;
  /** Short kicker shown above the title. */
  kicker: string;
  year: string;
  role: string;
  /** One-sentence summary for the plate. */
  summary: string;
  /** Longer detail revealed alongside the plate. */
  detail: string;
  stack: string[];
  href?: string;
  /** Drives the generated plate artwork — no stock imagery. */
  plate: "ledger" | "grid" | "orbit" | "stack" | "mesh" | "wave";
}

export interface Capability {
  index: string;
  title: string;
  body: string;
  tags: string[];
  /** Optional credential badge shown on the tile, e.g. "n8n verified creator". */
  badge?: string;
}

/** A short position statement used by the Approach band. */
export interface Principle {
  index: string;
  title: string;
  body: string;
}

/** A group of skills shown as one card in the toolkit carousel. */
export interface ToolkitGroup {
  group: string;
  items: string[];
}

/** One stage of the process pipeline. */
export interface ProcessStep {
  index: string;
  title: string;
  steps: string[];
}

/** Something being worked on right now, shown in the Now band. */
export interface CurrentItem {
  title: string;
  note: string;
}

export interface Metric {
  value: string;
  label: string;
}
