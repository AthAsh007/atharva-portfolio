"use client";

import { useEffect } from "react";

/**
 * Writes a smoothed scroll-velocity value to `--sv` on each .marquee-band
 * (-1..1, 0 at rest) so the bands skew with the scroll, the classic awwwards
 * touch. Decays to 0 when the scroll stops, so nothing sits tilted.
 *
 * Cheap at rest: the rAF loop only runs while scrolling or settling, writes
 * only when the rounded value changes, and targets the bands rather than
 * <html> so the rest of the tree is not restyled. No-op under reduced motion,
 * on touch pointers, or when the page has no bands.
 */
export function useScrollVelocity() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const bands = Array.from(document.querySelectorAll<HTMLElement>(".marquee-band"));
    if (bands.length === 0) return;

    let last = window.scrollY;
    let v = 0;
    let raf = 0;
    let written = "0.000";

    const write = (value: string) => {
      if (value === written) return;
      written = value;
      for (const band of bands) band.style.setProperty("--sv", value);
    };

    const loop = () => {
      const y = window.scrollY;
      const dv = y - last;
      last = y;
      // exponential moving average of per-frame delta, then normalize
      v = v * 0.82 + dv * 0.18;
      if (Math.abs(v) < 0.001 && dv === 0) {
        v = 0;
        write("0.000");
        raf = 0;
        return;
      }
      const sv = Math.max(-1, Math.min(1, v / 28));
      write(sv.toFixed(3));
      raf = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      for (const band of bands) band.style.removeProperty("--sv");
    };
  }, []);
}
