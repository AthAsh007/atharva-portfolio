import type { Config } from "tailwindcss";

/**
 * Design system: `studio-folio` template.
 * Source of truth for the raw values:
 *   website-redesign-services-prod/templates/studio-folio/{tokens.ts,style-guide.md}
 *
 * Vibe: bold index, project plates, art-directed. Radius 0. Mono + ONE accent.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        rule: "var(--rule)",
        accent: "var(--accent)",
        night: "var(--night)",
        "night-muted": "var(--night-muted)",
        "night-rule": "var(--night-rule)",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
      // studio-folio typographyScale
      fontSize: {
        // Sized so the longest line ("ASHTEKAR" — 9.4em in Syne 800 at this
        // tracking) sits flush inside the shell instead of bleeding off-screen.
        display: ["clamp(2rem, 9.3vw, 8.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "800" }],
        h1: ["clamp(2.25rem, 6vw, 3.5rem)", { lineHeight: "1.0", letterSpacing: "-0.02em", fontWeight: "800" }],
        h2: ["clamp(1.6rem, 3.6vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "700" }],
        h3: ["1.25rem", { lineHeight: "1.25", fontWeight: "700" }],
        body: ["1.05rem", { lineHeight: "1.65", fontWeight: "400" }],
        small: ["0.8125rem", { lineHeight: "1.4", fontWeight: "600" }],
        index: ["clamp(3.5rem, 11vw, 8.5rem)", { lineHeight: "0.8", letterSpacing: "-0.04em", fontWeight: "800" }],
      },
      // studio-folio spacingScale
      spacing: {
        s1: "0.5rem",
        s2: "1rem",
        s3: "2rem",
        s4: "3.5rem",
        s5: "5.5rem",
        s6: "8rem",
      },
      borderRadius: {
        // studio-folio: borderRadius "0" — nothing is rounded, ever.
        none: "0",
      },
      maxWidth: {
        shell: "88rem",
        measure: "38rem",
      },
    },
  },
  plugins: [],
};

export default config;
