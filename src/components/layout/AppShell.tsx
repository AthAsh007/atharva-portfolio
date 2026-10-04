"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Starfield } from "./Starfield";
import { FloatingCTA } from "./FloatingCTA";
import { ContactModalProvider } from "@/components/ui/ContactModal";
import { useMotionEnabled } from "@/hooks/useMotionEnabled";
import { useReveal } from "@/hooks/useReveal";

/* Pointer-only extras: split out of the first bundle and only mounted on a
   device that can hover with a fine pointer. */
const Cursor = dynamic(() => import("./Cursor").then((m) => m.Cursor), { ssr: false });
const CursorGlow = dynamic(() => import("./CursorGlow").then((m) => m.CursorGlow), { ssr: false });

declare global {
  interface Window {
    __revealSafety?: number;
  }
}

/**
 * Loads the command palette and the easter egg once the browser is idle (or
 * on the first interaction that needs them), so neither sits in the critical
 * path. A palette request that arrives before the chunk has loaded (the nav
 * hint button, Cmd/Ctrl+K, "/") is replayed once it has mounted.
 */
function useIdleExtras() {
  const [extras, setExtras] = useState<{ Palette: ComponentType; Egg: ComponentType } | null>(null);
  const [pendingOpen, setPendingOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let started = false;

    const detach = () => {
      window.removeEventListener("cmdk:open", onOpen);
      window.removeEventListener("keydown", onKey);
    };

    const load = () => {
      if (started) return;
      started = true;
      Promise.all([import("./CommandPalette"), import("./EasterEgg")]).then(([p, e]) => {
        if (cancelled) return;
        // from here on the palette owns these events; drop the bridge so a
        // second Cmd/Ctrl+K toggles it closed instead of reopening it
        detach();
        setExtras({ Palette: p.CommandPalette, Egg: e.EasterEgg });
      });
    };

    const onOpen = () => {
      setPendingOpen(true);
      load();
    };
    const onKey = (e: KeyboardEvent) => {
      const typing = ["INPUT", "TEXTAREA"].includes((document.activeElement?.tagName ?? "").toUpperCase());
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
        e.preventDefault();
        onOpen();
      } else {
        load();
      }
    };

    window.addEventListener("cmdk:open", onOpen);
    window.addEventListener("keydown", onKey);

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = w.requestIdleCallback ? w.requestIdleCallback(load, { timeout: 2500 }) : undefined;
    const timeoutId = idleId === undefined ? window.setTimeout(load, 1500) : undefined;

    return () => {
      cancelled = true;
      detach();
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  // Replay a request that arrived before the chunk. Parent effects run after
  // child effects, so the freshly mounted palette is already listening.
  useEffect(() => {
    if (!extras || !pendingOpen) return;
    setPendingOpen(false);
    window.dispatchEvent(new Event("cmdk:open"));
  }, [extras, pendingOpen]);

  return extras;
}

/**
 * App chrome and the motion engines, mounted once for the whole document. Each
 * engine no-ops under prefers-reduced-motion. The background stack is
 * Starfield (-z-10) then CursorGlow (z-0) then the content (z-1). The command
 * palette and easter egg sit above everything.
 */
export function AppShell({ children }: { children: ReactNode }) {
  useMotionEnabled();
  useReveal();

  const extras = useIdleExtras();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    // hydrated: the reveal observer is live, so the no-JS safety net can stand down
    if (window.__revealSafety) window.clearTimeout(window.__revealSafety);
    setFinePointer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  return (
    <ContactModalProvider>
      <Starfield />
      {finePointer && <CursorGlow />}

      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-[var(--on-accent)]"
      >
        Skip to content
      </a>

      <Navbar />
      <div className="relative z-[1]">
        <main id="top" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
      </div>

      <FloatingCTA />
      {extras && (
        <>
          <extras.Palette />
          <extras.Egg />
        </>
      )}
      {finePointer && <Cursor />}

      {/* one polite live region for status messages (copy results); see
          announce() in lib/overlay */}
      <p id="sr-status" role="status" aria-live="polite" className="sr-only" />
    </ContactModalProvider>
  );
}
