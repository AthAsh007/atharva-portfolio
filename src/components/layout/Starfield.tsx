"use client";

import { useEffect, useRef } from "react";
import { mouseStore } from "@/lib/mouseStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The background: a fixed starry night over the forest.
 *
 *  - a static vertical gradient sky (deep green-black to forest green)
 *  - a canvas of stars that twinkle, drift a little with the cursor, and
 *    occasionally throw a shooting star
 *
 * Static-first: with reduced motion the stars are drawn once and hold still.
 * Hidden entirely in the light theme, where the loop also pauses. Pointer-events
 * none. With motion on, the canvas fades up after its first draw (night falls)
 * rather than popping in after hydration.
 *
 * Budget: the twinkle is capped at ~40fps on desktop and ~30fps on phones and
 * tablets (it reads the same as 144fps, for a fraction of the work). Stars are
 * blitted from a few pre-rendered soft-dot sprites instead of one arc path
 * each. On coarse pointers DPR is capped at 1.5, the star count drops and there
 * is no cursor parallax. The two nebula glows are painted once per size into
 * an offscreen canvas and blitted. Star positions are stored normalised and
 * kept across effect runs (the hydration pass, a reduced-motion flip), so the
 * sky is seeded once: the URL bar or a re-run only rescales it, and only a
 * real width change reshuffles it.
 */

interface Star {
  /** 0..1 of the canvas width / height */
  x: number;
  y: number;
  /** index into SPRITE_RADII */
  size: number;
  base: number;
  amp: number;
  speed: number;
  phase: number;
  depth: number;
}

interface Shooter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

/** Star radii in CSS px; each star snaps to the nearest one. */
const SPRITE_RADII = [0.4, 0.7, 1.0, 1.35];

interface Sky {
  stars: Star[];
  builtW: number;
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sky = useRef<Sky>({ stars: [], builtW: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.documentElement;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const animate = !reduced;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    const frameGap = coarse ? 33 : 25; // ~30fps on touch, ~40fps on desktop

    let w = 0;
    let h = 0;
    let shooters: Shooter[] = [];
    let nebulaLayer: HTMLCanvasElement | null = null;
    let raf = 0;
    let lastSpawn = 0;
    let lastFrame = 0;

    const isLight = () => root.dataset.theme === "light";

    // one soft dot per size, drawn at device resolution and blitted 1:1
    const sprites = SPRITE_RADII.map((r) => {
      const size = Math.ceil((r * 2 + 2) * dpr);
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const o = c.getContext("2d");
      if (o) {
        o.fillStyle = "#f6f1e2";
        o.beginPath();
        o.arc(size / 2, size / 2, r * dpr, 0, Math.PI * 2);
        o.fill();
      }
      return { canvas: c, css: size / dpr };
    });

    const buildStars = () => {
      const count = Math.max(
        coarse ? 60 : 90,
        Math.min(300, Math.round((w * h) / (coarse ? 12000 : 8000))),
      );
      sky.current = {
        builtW: w,
        stars: Array.from({ length: count }, () => {
          const r = Math.random() * 1.3 + 0.25;
          let size = 0;
          for (let i = 1; i < SPRITE_RADII.length; i++) {
            if (Math.abs(SPRITE_RADII[i] - r) < Math.abs(SPRITE_RADII[size] - r)) size = i;
          }
          return {
            x: Math.random(),
            y: Math.random(),
            size,
            base: Math.random() * 0.5 + 0.28,
            amp: Math.random() * 0.4,
            speed: Math.random() * 1.6 + 0.3,
            phase: Math.random() * Math.PI * 2,
            depth: Math.random() * 0.8 + 0.2,
          };
        }),
      };
    };

    const buildNebula = () => {
      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const o = off.getContext("2d");
      if (!o) {
        nebulaLayer = null;
        return;
      }
      o.setTransform(dpr, 0, 0, dpr, 0, 0);
      const glow = (xr: number, yr: number, rad: number, hue: string) => {
        const g = o.createRadialGradient(w * xr, h * yr, 0, w * xr, h * yr, rad);
        g.addColorStop(0, hue);
        g.addColorStop(1, "transparent");
        o.fillStyle = g;
        o.fillRect(0, 0, w, h);
      };
      // soft forest glows behind the stars
      glow(0.2, 0.15, Math.max(w, h) * 0.5, "rgba(111, 174, 119, 0.10)");
      glow(0.85, 0.75, Math.max(w, h) * 0.55, "rgba(217, 171, 82, 0.07)");
      nebulaLayer = off;
    };

    /** Returns false when the layer is hidden (light theme, display:none). */
    const resize = () => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (cw === 0 || ch === 0) return false;
      if (cw === w && ch === h && nebulaLayer) return true;
      w = cw;
      h = ch;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // only a real width change (rotation, window resize) re-seeds the sky;
      // a height-only change such as the mobile URL bar just rescales it
      const { stars, builtW } = sky.current;
      if (!stars.length || Math.abs(w - builtW) > 1) buildStars();
      buildNebula();
      return true;
    };

    const draw = (t: number, dt: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (nebulaLayer) ctx.drawImage(nebulaLayer, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const parallax = animate && !coarse;
      const { nx, ny } = mouseStore.current;

      for (const s of sky.current.stars) {
        const tw = animate
          ? s.base + Math.sin(t * 0.001 * s.speed + s.phase) * s.amp
          : s.base;
        const sprite = sprites[s.size];
        const px = s.x * w + (parallax ? nx * 12 * s.depth : 0);
        const py = s.y * h + (parallax ? ny * 12 * s.depth : 0);
        ctx.globalAlpha = Math.max(0.05, Math.min(1, tw));
        ctx.drawImage(sprite.canvas, px - sprite.css / 2, py - sprite.css / 2, sprite.css, sprite.css);
      }
      ctx.globalAlpha = 1;

      // shooting stars
      if (animate && t > lastSpawn) {
        lastSpawn = t + 3500 + Math.random() * 5000;
        const fromLeft = Math.random() < 0.5;
        shooters.push({
          x: fromLeft ? Math.random() * w * 0.3 : w * (0.7 + Math.random() * 0.3),
          y: Math.random() * h * 0.45,
          vx: (fromLeft ? 1 : -1) * (5 + Math.random() * 3),
          vy: 2 + Math.random() * 2,
          life: 0,
          max: 850 + Math.random() * 350,
        });
      }
      // velocities are per 60fps frame; scale by real elapsed time so a
      // throttled loop moves shooters at the same speed
      const step = Math.min(dt, 100) / 16;
      shooters = shooters.filter((sh) => {
        sh.life += 16 * step;
        sh.x += sh.vx * step;
        sh.y += sh.vy * step;
        const p = sh.life / sh.max;
        if (p >= 1) return false;
        const tail = 90;
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * (tail / 6), sh.y - sh.vy * (tail / 6));
        grad.addColorStop(0, `rgba(246, 241, 226, ${0.9 * (1 - p)})`);
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * (tail / 6), sh.y - sh.vy * (tail / 6));
        ctx.stroke();
        return true;
      });

      // first frame on screen: let the sky fade up (globals.css)
      if (!canvas.hasAttribute("data-ready")) canvas.setAttribute("data-ready", "");
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = lastFrame ? t - lastFrame : 16;
      if (dt < frameGap) return;
      lastFrame = t;
      draw(t, dt);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
    };

    /** Draw or run only while the sky is actually visible. */
    const sync = () => {
      const visible = !document.hidden && !isLight() && resize();
      if (!visible) {
        stop();
        return;
      }
      if (animate) {
        if (!raf) raf = requestAnimationFrame(loop);
      } else {
        draw(0, 0);
      }
    };

    if (animate && !coarse) mouseStore.start();
    sync();

    const onResize = () => {
      if (!resize()) return;
      if (!animate) draw(0, 0);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    const themeObserver = new MutationObserver(sync);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", sync);

    return () => {
      stop();
      ro.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduced]);

  return (
    <div
      className="starfield-layer pointer-events-none fixed inset-x-0 top-0 -z-10 h-screen supports-[height:100lvh]:h-[100lvh]"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, var(--sky-1) 0%, var(--sky-2) 45%, var(--sky-3) 100%)" }}
      />
      <div className="dot-grid absolute inset-0" />
      <canvas ref={canvasRef} className="starfield-canvas h-full w-full" />
    </div>
  );
}
