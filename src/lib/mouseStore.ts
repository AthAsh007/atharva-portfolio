"use client";

import { useEffect } from "react";

/**
 * The app's single input coordinator.
 *
 *  - ONE `mousemove` listener feeds a mutable `mouse` snapshot (clients read it
 *    inside their own rAF loops with no React re-renders).
 *  - A single rAF loop drives every registered 3D-tilt element. Each component
 *    registers its DOM node once; the loop recomputes rects and applies lerped
 *    rotate/scale. Registering is lazy: the loop only runs while at least one
 *    tilter is mounted.
 *
 * Why centralize: six plates each spinning their own rAF is fine; but sharing
 * one loop (and one listener) keeps the budget obvious and avoids rect thrash.
 */

export interface MouseState {
  x: number;
  y: number;
  nx: number; // -1 .. 1, horizontal center-normalized
  ny: number; // -1 .. 1, vertical
  interactive: boolean;
  /** The interactive element under the cursor, for magnetic snapping. */
  hoverEl: HTMLElement | null;
}

export const mouse: MouseState = { x: 0, y: 0, nx: 0, ny: 0, interactive: false, hoverEl: null };

const INTERACTIVE_SELECTOR = "a, button, [data-magnetic], [data-cta], [data-tilt], [data-wipe]";
let tracking = false;

function onMove(e: MouseEvent) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.nx = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.ny = (e.clientY / window.innerHeight - 0.5) * 2;
  const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
  const interactiveEl = (el?.closest(INTERACTIVE_SELECTOR) as HTMLElement | null) ?? null;
  mouse.interactive = !!interactiveEl;
  mouse.hoverEl = interactiveEl;
}

function startTracking() {
  if (tracking || typeof window === "undefined") return;
  tracking = true;
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseleave", () => {
    mouse.interactive = false;
  });
}

/** Public handle consumed by the motion engines. */
export const mouseStore = {
  current: mouse,
  start: startTracking,
};

interface Tilter {
  el: HTMLElement;
  max: number;
  tx: number;
  ty: number;
  near: boolean;
}
const tilters: Tilter[] = [];
let tiltRaf = 0;

function tick() {
  tiltRaf = requestAnimationFrame(tick);
  for (let i = 0; i < tilters.length; i++) {
    const t = tilters[i];
    const r = t.el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const px = ((mouse.x - cx) / r.width) * 2;
    const py = ((mouse.y - cy) / r.height) * 2;
    const inside = px > -1.5 && px < 1.5 && py > -1.5 && py < 1.5;

    if (inside) {
      t.near = true;
      t.tx += (px * t.max - t.tx) * 0.18;
      t.ty += (-py * t.max - t.ty) * 0.18;
      t.el.style.transform = `perspective(900px) rotateY(${t.tx}deg) rotateX(${t.ty}deg) scale3d(1.03,1.03,1.03)`;
      t.el.style.willChange = "transform";
      t.el.classList.add("glow");
    } else {
      // smooth settle back to neutral
      t.tx *= 0.82;
      t.ty *= 0.82;
      if (Math.abs(t.tx) < 0.03 && Math.abs(t.ty) < 0.03) {
        t.tx = 0;
        t.ty = 0;
        t.near = false;
        t.el.style.transform = "";
        t.el.style.willChange = "";
        t.el.classList.remove("glow");
      } else {
        t.el.style.transform = `perspective(900px) rotateY(${t.tx}deg) rotateX(${t.ty}deg) scale3d(1.01,1.01,1.01)`;
      }
    }
  }
  if (tilters.length === 0) stopTiltLoop();
}

function stopTiltLoop() {
  cancelAnimationFrame(tiltRaf);
  tiltRaf = 0;
}

export function registerTilt(el: HTMLElement, max = 8) {
  if (!tracking) startTracking();
  const t: Tilter = { el, max, tx: 0, ty: 0, near: false };
  tilters.push(t);
  if (!tiltRaf) tick();
  return () => {
    const i = tilters.indexOf(t);
    if (i >= 0) tilters.splice(i, 1);
  };
}

/** Mount once in any client component to begin tracking. */
export function useMouseStore() {
  useEffect(() => {
    startTracking();
  }, []);
  return mouse;
}
