import type { Config } from "tailwindcss";

/**
 * Design system: `midnight-glass` template (adopted from
 * website-redesign-services-prod/templates/midnight-glass). V2 of studio-folio.
 * A deep midnight canvas with frosted-glass panels, luminous coral+violet
 * accents, and full motion. Radius 16px. The cursive `display` family is the
 * name accent. Source of truth for raw values lives in src/app/globals.css;
 * the tokens here are the Tailwind mirror.                                */

/* Theme colours live in CSS variables so they flip with data-theme. A bare
   var() cannot take an opacity modifier, so `border-rule/50` or `bg-accent/10`
   used to generate no CSS at all. Mixing with transparent through
   <alpha-value> makes every `/NN` modifier work, while the plain utility stays
   at full strength. */
const themed = (name: string) =>
  `color-mix(in srgb, var(--${name}) calc(<alpha-value> * 100%), transparent)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  // hover: only applies on devices that can really hover, so a tap on a touch
  // screen never leaves a card lifted or a button glowing.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        paper: themed("paper"),
        surface: themed("surface"),
        "surface-2": themed("surface-2"),
        ink: themed("ink"),
        muted: themed("muted"),
        rule: themed("rule"),
        accent: themed("accent"),
        "accent-2": themed("accent-2"),
        "on-accent": themed("on-accent"),
        night: themed("night"),
        "night-muted": themed("night-muted"),
        "night-rule": themed("night-rule"),
        glow: themed("glow-soft"),
        "liquid-tint": themed("liquid-tint"),
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
        // h3 and body grow gently past ~800px, so card titles and copy keep
        // their weight next to the wide plates on 1920px+ screens
        h3: ["clamp(1.25rem, 1rem + 0.5vw, 1.5rem)", { lineHeight: "1.25", fontWeight: "700" }],
        body: ["clamp(1.0625rem, 1rem + 0.2vw, 1.1875rem)", { lineHeight: "1.65", fontWeight: "400" }],
        small: ["0.8125rem", { lineHeight: "1.4", fontWeight: "600" }],
        // the big index numerals on the Approach and Process cards
        numeral: ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1" }],
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
      // two glass radii: cards, panels and dialogs, then the hero sheet and
      // the featured case study
      borderRadius: {
        glass: "22px",
        "glass-lg": "28px",
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
