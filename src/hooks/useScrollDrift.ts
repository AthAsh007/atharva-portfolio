"use client";

import { useEffect } from "react";

/**
 * The signature moment's engine.
 *
 * Writes a --drift custom property (-1 → 1, where 0 is dead-centre of the
 * viewport) onto every [data-drift] element, so CSS can counter-move the
 * oversized index numerals against the scroll. rAF-throttled: scroll events
 * only mark the frame dirty, all reads and writes happen once per frame.
 */
export function useScrollDrift() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let nodes: HTMLElement[] = Array.from(document.querySelectorAll("[data-drift]"));

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewport) continue; // off-screen: skip the write
        const centre = rect.top + rect.height / 2;
        const drift = (centre - viewport / 2) / (viewport / 2);
        node.style.setProperty("--drift", Math.max(-1, Math.min(1, drift)).toFixed(3));
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const onResize = () => {
      nodes = Array.from(document.querySelectorAll("[data-drift]"));
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);
}
