"use client";

import { useEffect } from "react";

/**
 * Writes a smoothed scroll-velocity value to `--sv` on <html> (-1..1, 0 at
 * rest). The marquee bands read it to skew with the scroll, the classic
 * awwwards touch. Decays to 0 when the scroll stops, so nothing sits tilted.
 * No-op under reduced motion.
 */
export function useScrollVelocity() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;

    let last = window.scrollY;
    let v = 0;
    let raf = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const y = window.scrollY;
      const dv = y - last;
      last = y;
      // exponential moving average of per-frame delta, then normalize
      v = v * 0.82 + dv * 0.18;
      const sv = Math.max(-1, Math.min(1, v / 28));
      root.style.setProperty("--sv", sv.toFixed(3));
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      root.style.removeProperty("--sv");
    };
  }, []);
}
