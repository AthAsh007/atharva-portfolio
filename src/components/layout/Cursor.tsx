"use client";

import { useEffect, useRef } from "react";
import { mouseStore } from "@/lib/mouseStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * A better custom cursor for pointer-fine devices.
 *
 *  - a small dot follows the cursor tightly; a larger ring trails behind it
 *  - both use mix-blend-mode: difference, so they invert whatever is behind
 *    them and stay visible on the forest, the gold and the glass
 *  - over a link, button or tilted plate the ring grows and the pair is pulled
 *    toward the element's centre (magnetic), so targets feel like they catch
 *
 * It stays invisible until the first real mousemove (no pair parked in the
 * top-left corner after hydration), fades out when the pointer leaves the
 * window, and its loop parks once dot, ring and scale have settled, waking on
 * the next move or scroll. Disabled on touch and under prefers-reduced-motion
 * (live). Pointer-events-none, so it never blocks a click.
 */
export function Cursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduced) return;
    if (!wrapRef.current || !ringRef.current || !dotRef.current) return;

    mouseStore.start();
    const m = mouseStore.current;
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;

    let dx = 0,
      dy = 0,
      rx = 0,
      ry = 0;
    let ds = 1,
      rs = 1;
    let placed = false;
    let raf = 0;

    const loop = () => {
      raf = 0;
      if (!m.seen) return;

      let tx = m.x;
      let ty = m.y;

      // magnetic pull toward the centre of the hovered target
      const el = m.hoverEl;
      if (el && el.isConnected) {
        const r = el.getBoundingClientRect();
        tx += (r.left + r.width / 2 - tx) * 0.28;
        ty += (r.top + r.height / 2 - ty) * 0.28;
      }

      // first sighting: start on the pointer instead of flying in from 0,0
      if (!placed) {
        dx = rx = tx;
        dy = ry = ty;
        placed = true;
      }

      dx += (tx - dx) * 0.4;
      dy += (ty - dy) * 0.4;
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;

      const tds = m.interactive ? 0.4 : 1;
      const trs = m.interactive ? 1.9 : 1;
      ds += (tds - ds) * 0.2;
      rs += (trs - rs) * 0.2;

      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${ds.toFixed(3)})`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${rs.toFixed(3)})`;
      wrap.style.opacity = m.inside ? "1" : "0";

      const settled =
        Math.abs(tx - dx) < 0.1 &&
        Math.abs(ty - dy) < 0.1 &&
        Math.abs(tx - rx) < 0.1 &&
        Math.abs(ty - ry) < 0.1 &&
        Math.abs(tds - ds) < 0.002 &&
        Math.abs(trs - rs) < 0.002;
      if (!settled) raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", wake, { passive: true });
    document.addEventListener("mouseover", wake, { passive: true });
    document.addEventListener("mouseout", wake, { passive: true });
    // a magnet target moves under a still pointer while the page scrolls
    window.addEventListener("scroll", wake, { passive: true });
    wake();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", wake);
      document.removeEventListener("mouseover", wake);
      document.removeEventListener("mouseout", wake);
      window.removeEventListener("scroll", wake);
      wrap.style.opacity = "0";
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-0 w-0 overflow-visible transition-opacity duration-300"
      style={{ opacity: 0 }}
      data-cursor
    >
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-white mix-blend-difference"
        style={{ marginLeft: -18, marginTop: -18 }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{ marginLeft: -4, marginTop: -4 }}
      />
    </div>
  );
}
