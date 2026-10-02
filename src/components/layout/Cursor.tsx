"use client";

import { useEffect, useRef } from "react";
import { mouseStore } from "@/lib/mouseStore";

/**
 * A better custom cursor for pointer-fine devices.
 *
 *  - a small dot follows the cursor tightly; a larger ring trails behind it
 *  - both use mix-blend-mode: difference, so they invert whatever is behind
 *    them and stay visible on the forest, the gold and the glass
 *  - over a link, button or tilted plate the ring grows and the pair is pulled
 *    toward the element's centre (magnetic), so targets feel like they catch
 *
 * Disabled on touch and under prefers-reduced-motion. Pointer-events-none, so
 * it never blocks a click.
 */
export function Cursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    if (!wrapRef.current || !ringRef.current || !dotRef.current) return;

    mouseStore.start();
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    wrap.style.opacity = "1";

    let dx = 0,
      dy = 0,
      rx = 0,
      ry = 0;
    let ds = 1,
      rs = 1;
    let raf = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);

      let tx = mouseStore.current.x;
      let ty = mouseStore.current.y;

      // magnetic pull toward the centre of the hovered target
      const el = mouseStore.current.hoverEl;
      if (el) {
        const r = el.getBoundingClientRect();
        tx += (r.left + r.width / 2 - tx) * 0.28;
        ty += (r.top + r.height / 2 - ty) * 0.28;
      }

      dx += (tx - dx) * 0.4;
      dy += (ty - dy) * 0.4;
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;

      const tds = mouseStore.current.interactive ? 0.4 : 1;
      const trs = mouseStore.current.interactive ? 1.9 : 1;
      ds += (tds - ds) * 0.2;
      rs += (trs - rs) * 0.2;

      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${ds.toFixed(3)})`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${rs.toFixed(3)})`;
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-0 w-0 overflow-visible"
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
