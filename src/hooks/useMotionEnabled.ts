"use client";

import { useEffect } from "react";

/**
 * Opts the document into motion by setting data-motion="on" on <html>.
 *
 * The page is authored static-first: without this attribute every animated
 * element is already in its final state. So if JS never runs, or the visitor
 * has asked for reduced motion, nothing is hidden and nothing moves.
 */
export function useMotionEnabled() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const root = document.documentElement;
      if (query.matches) root.removeAttribute("data-motion");
      else root.setAttribute("data-motion", "on");
    };

    apply();
    query.addEventListener("change", apply);
    return () => {
      query.removeEventListener("change", apply);
      document.documentElement.removeAttribute("data-motion");
    };
  }, []);
}
