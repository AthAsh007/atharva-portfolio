"use client";

import { useEffect } from "react";

/**
 * Flips data-revealed="true" on every [data-reveal] / [data-wipe] element as it
 * enters the viewport. One observer for the whole document — cheaper than a ref
 * and an observer per component, and it picks up nodes added later.
 *
 * A second observer keeps data-inview on each .liquid-glass pane while it is
 * on screen, so the travelling sheen (globals.css) only runs where it is seen.
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

    const inview = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.toggleAttribute("data-inview", entry.isIntersecting);
      }
    });
    document.querySelectorAll(".liquid-glass").forEach((node) => inview.observe(node));

    // panes mounted later (extra carousel copies, toasts) need observing too
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(".liquid-glass")) inview.observe(node);
          node.querySelectorAll(".liquid-glass").forEach((n) => inview.observe(n));
        });
        record.removedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(".liquid-glass")) inview.unobserve(node);
          node.querySelectorAll(".liquid-glass").forEach((n) => inview.unobserve(n));
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      inview.disconnect();
      mo.disconnect();
    };
  }, []);
}
