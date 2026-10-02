"use client";

import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Cursor } from "./Cursor";
import { CursorGlow } from "./CursorGlow";
import { Starfield } from "./Starfield";
import { FloatingCTA } from "./FloatingCTA";
import { CommandPalette } from "./CommandPalette";
import { EasterEgg } from "./EasterEgg";
import { ContactModalProvider } from "@/components/ui/ContactModal";
import { useMotionEnabled } from "@/hooks/useMotionEnabled";
import { useReveal } from "@/hooks/useReveal";
import { useScrollDrift } from "@/hooks/useScrollDrift";
import { useScrollVelocity } from "@/hooks/useScrollVelocity";

/**
 * App chrome and the motion engines, mounted once for the whole document. Each
 * engine no-ops under prefers-reduced-motion. The background stack is
 * Starfield (-z-10) then CursorGlow (z-0) then the content (z-1). The command
 * palette and easter egg sit above everything.
 */
export function AppShell({ children }: { children: ReactNode }) {
  useMotionEnabled();
  useReveal();
  useScrollDrift();
  useScrollVelocity();

  return (
    <ContactModalProvider>
      <Starfield />
      <CursorGlow />

      <a
        href="#index"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-[var(--on-accent)]"
      >
        Skip to content
      </a>

      <Navbar />
      <div className="page-in relative z-[1]">
        <main id="top">{children}</main>
        <Footer />
      </div>

      <FloatingCTA />
      <CommandPalette />
      <EasterEgg />
      <Cursor />
    </ContactModalProvider>
  );
}
