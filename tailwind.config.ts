import type { Config } from "tailwindcss";

/**
 * Design system: `midnight-glass` template (adopted from
 * website-redesign-services-prod/templates/midnight-glass). V2 of studio-folio.
 * A deep midnight canvas with frosted-glass panels, luminous coral+violet
 * accents, and full motion. Radius 16px. The cursive `display` family is the
 * name accent. Source of truth for raw values lives in src/app/globals.css;
 * the tokens here are the Tailwind mirror.                                */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        rule: "var(--rule)",
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        "on-accent": "var(--on-accent)",
        night: "var(--night)",
        "night-muted": "var(--night-muted)",
        "night-rule": "var(--night-rule)",
        glow: "var(--glow-soft)",
        "liquid-tint": "var(--liquid-tint)",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        display: ["clamp(3rem, 14vw, 10rem)", { lineHeight: "0.85", letterSpacing: "-0.03em", fontWeight: "600" }],
        h1: ["clamp(2.5rem, 6.5vw, 4.25rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "800" }],
        h2: ["clamp(1.7rem, 4vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "700" }],
        h3: ["1.25rem", { lineHeight: "1.25", fontWeight: "700" }],
        body: ["1.0625rem", { lineHeight: "1.65", fontWeight: "400" }],
        small: ["0.8125rem", { lineHeight: "1.4", fontWeight: "600" }],
        index: ["clamp(5.5rem, 20vw, 14rem)", { lineHeight: "0.75", letterSpacing: "-0.05em", fontWeight: "800" }],
      },
      spacing: {
        s1: "0.5rem",
        s2: "1rem",
        s3: "2rem",
        s4: "3.5rem",
        s5: "5.5rem",
        s6: "8rem",
      },
      borderRadius: {
        glass: "16px",
      },
      maxWidth: {
        shell: "88rem",
        measure: "38rem",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        "out-expo": "cubic-bezier(0.15, 0, 0.2, 1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
