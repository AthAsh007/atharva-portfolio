"use client";

import { useEffect } from "react";

/**
 * The app's single input coordinator.
 *
 *  - ONE `mousemove` listener feeds a mutable `mouse` snapshot (clients read it
 *    inside their own rAF loops with no React re-renders). It only stores the
 *    coordinates: at up to 1000Hz on a gaming mouse, a hit-test per event would
 *    be wasted work.
 *  - The hovered interactive element comes from delegated `mouseover`, which
 *    fires once per element boundary rather than once per pixel.
 *  - `mouseout` with no related target means the pointer left the window, so
 *    the cursor layers can fade out instead of sitting stuck at the edge.
 *  - A single rAF loop drives every registered 3D-tilt element. Each component
 *    registers its DOM node once; the loop measures every plate first, then
 *    writes every transform, so a frame never forces layout between writes.
 *    The loop is on demand: a mousemove or scroll kicks it, and it parks
 *    itself once the pointer is still and every plate has settled, so an idle
 *    page measures nothing.
 */

export interface MouseState {
  x: number;
  y: number;
  nx: number; // -1 .. 1, horizontal center-normalized
  ny: number; // -1 .. 1, vertical
  interactive: boolean;
  /** The interactive element under the cursor, for magnetic snapping. */
  hoverEl: HTMLElement | null;
  /** True once a real mousemove has arrived (x/y are meaningless before). */
  seen: boolean;
  /** False while the pointer is outside the window. */
  inside: boolean;
}

export const mouse: MouseState = {
  x: 0,
  y: 0,
  nx: 0,
  ny: 0,
  interactive: false,
  hoverEl: null,
  seen: false,
  inside: false,
};

const INTERACTIVE_SELECTOR = "a, button, [data-magnetic], [data-cta], [data-tilt], [data-wipe]";
let tracking = false;
/** Set by input; tells the tilt loop that the pointer or the plates may have moved. */
let dirty = false;

function onMove(e: MouseEvent) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.nx = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.ny = (e.clientY / window.innerHeight - 0.5) * 2;
  mouse.seen = true;
  mouse.inside = true;
  kickTilt();
}

function onOver(e: MouseEvent) {
  const target = e.target instanceof Element ? e.target : null;
  const interactiveEl = (target?.closest(INTERACTIVE_SELECTOR) as HTMLElement | null) ?? null;
  mouse.interactive = !!interactiveEl;
  mouse.hoverEl = interactiveEl;
  mouse.inside = true;
}

function onOut(e: MouseEvent) {
  if (e.relatedTarget) return;
  // left the window
  mouse.inside = false;
  mouse.interactive = false;
  mouse.hoverEl = null;
  kickTilt();
}

function startTracking() {
  if (tracking || typeof window === "undefined") return;
  tracking = true;
  window.addEventListener("mousemove", onMove, { passive: true });
  document.addEventListener("mouseover", onOver, { passive: true });
  document.addEventListener("mouseout", onOut, { passive: true });
  // the page scrolling under a still cursor moves plates relative to it
  window.addEventListener("scroll", kickTilt, { passive: true });
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
  tiltRaf = 0;
  const moved = dirty;
  dirty = false;
  let busy = false;

  // pass 1: read. A plate at rest only needs measuring when something moved.
  const rects: (DOMRect | null)[] = tilters.map((t) =>
    moved || t.near ? t.el.getBoundingClientRect() : null,
  );

  // pass 2: write
  for (let i = 0; i < tilters.length; i++) {
    const t = tilters[i];
    const r = rects[i];
    if (!r) continue;

    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const px = ((mouse.x - cx) / r.width) * 2;
    const py = ((mouse.y - cy) / r.height) * 2;
    const inside = mouse.inside && px > -1.5 && px < 1.5 && py > -1.5 && py < 1.5;

    if (inside) {
      t.near = true;
      const dx = px * t.max - t.tx;
      const dy = -py * t.max - t.ty;
      t.tx += dx * 0.18;
      t.ty += dy * 0.18;
      if (Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02) busy = true;
      t.el.style.transform = `perspective(900px) rotateY(${t.tx}deg) rotateX(${t.ty}deg) scale3d(1.03,1.03,1.03)`;
      t.el.style.willChange = "transform";
      t.el.classList.add("glow");
    } else if (t.near) {
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
        busy = true;
        t.el.style.transform = `perspective(900px) rotateY(${t.tx}deg) rotateX(${t.ty}deg) scale3d(1.01,1.01,1.01)`;
      }
    }
  }

  // keep running while anything is still easing; otherwise park until input
  if ((busy || dirty) && tilters.length > 0) tiltRaf = requestAnimationFrame(tick);
}

function kickTilt() {
  dirty = true;
  if (!tiltRaf && tilters.length > 0) tiltRaf = requestAnimationFrame(tick);
}

function stopTiltLoop() {
  cancelAnimationFrame(tiltRaf);
  tiltRaf = 0;
}

export function registerTilt(el: HTMLElement, max = 8) {
  if (!tracking) startTracking();
  const t: Tilter = { el, max, tx: 0, ty: 0, near: false };
  tilters.push(t);
  kickTilt();
  return () => {
    const i = tilters.indexOf(t);
    if (i >= 0) tilters.splice(i, 1);
    if (tilters.length === 0) stopTiltLoop();
  };
}

/** Mount once in any client component to begin tracking. */
export function useMouseStore() {
  useEffect(() => {
    startTracking();
  }, []);
  return mouse;
}
