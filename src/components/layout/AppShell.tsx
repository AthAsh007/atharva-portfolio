"use client";

import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useMotionEnabled } from "@/hooks/useMotionEnabled";
import { useReveal } from "@/hooks/useReveal";
import { useScrollDrift } from "@/hooks/useScrollDrift";

/**
 * App chrome + the three motion engines, mounted once for the whole document.
 * Each one no-ops under prefers-reduced-motion.
 */
export function AppShell({ children }: { children: ReactNode }) {
  useMotionEnabled();
  useReveal();
  useScrollDrift();

  return (
    <>
      <a
        href="#index"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="top">{children}</main>
      <Footer />
    </>
  );
}
