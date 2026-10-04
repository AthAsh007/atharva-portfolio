"use client";

import { useEffect, useRef } from "react";
import { mouseStore } from "@/lib/mouseStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * A soft gold light that trails the pointer across the whole page. Sits above
 * the starfield and below the content, blended with `screen` so it lifts the
 * background near the cursor. AppShell only mounts it on a real hover pointer,
 * so touch devices never get the full-screen blend layer.
 *
 * It stays hidden until the pointer has actually been seen, then snaps to it
 * and fades in (no glow parked in the top-left corner on load), and fades out
 * when the pointer leaves the window. The loop parks once the glow catches up
 * and wakes on the next mousemove.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    mouseStore.start();
    const m = mouseStore.current;
    let x = m.x;
    let y = m.y;
    let placed = false;
    let raf = 0;

    const write = () => {
      el.style.setProperty("--gx", `${x.toFixed(0)}px`);
      el.style.setProperty("--gy", `${y.toFixed(0)}px`);
    };

    const loop = () => {
      raf = 0;
      if (!m.seen) return;
      el.toggleAttribute("data-on", m.inside);
      if (!placed) {
        // first sighting: start under the pointer rather than easing across
        x = m.x;
        y = m.y;
        placed = true;
        write();
        return;
      }
      const dx = m.x - x;
      const dy = m.y - y;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        // caught up: snap, write once and park until the pointer moves
        x = m.x;
        y = m.y;
        write();
        return;
      }
      x += dx * 0.1;
      y += dy * 0.1;
      write();
      raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    wake();
    window.addEventListener("mousemove", wake, { passive: true });
    document.addEventListener("mouseout", wake, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", wake);
      document.removeEventListener("mouseout", wake);
      el.removeAttribute("data-on");
    };
  }, [reduced]);

  if (reduced) return null;
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
