"use client";

import { useEffect } from "react";

/**
 * Flips data-revealed="true" on every [data-reveal] / [data-wipe] element as it
 * enters the viewport. One observer for the whole document — cheaper than a ref
 * and an observer per component, and it picks up nodes added later.
 */
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "true");
          observer.unobserve(entry.target); // reveal once, then stop paying for it
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    const targets = document.querySelectorAll("[data-reveal], [data-wipe]");
    targets.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);
}
