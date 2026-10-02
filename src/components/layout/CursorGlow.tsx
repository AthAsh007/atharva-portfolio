"use client";

import { useEffect, useRef } from "react";
import { mouseStore } from "@/lib/mouseStore";

/**
 * A soft gold light that trails the pointer across the whole page. Sits above
 * the starfield and below the content, blended with `screen` so it lifts the
 * background near the cursor. Off under reduced motion.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    mouseStore.start();
    let x = 0;
    let y = 0;
    let raf = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (mouseStore.current.x - x) * 0.1;
      y += (mouseStore.current.y - y) * 0.1;
      el.style.setProperty("--gx", `${x.toFixed(0)}px`);
      el.style.setProperty("--gy", `${y.toFixed(0)}px`);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
