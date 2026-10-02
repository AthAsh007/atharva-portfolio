"use client";

import { useEffect, useRef } from "react";
import { mouseStore } from "@/lib/mouseStore";

/**
 * The background: a fixed starry night over the forest.
 *
 *  - a static vertical gradient sky (deep green-black to forest green)
 *  - a canvas of stars that twinkle, drift a little with the cursor, and
 *    occasionally throw a shooting star
 *
 * Static-first: with motion off (or reduced motion) the stars are drawn once
 * and hold still. Hidden entirely in the light theme. Pointer-events none.
 */

interface Star {
  x: number;
  y: number;
  r: number;
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

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // gate on the media query directly: child effects run before the parent's
    // useMotionEnabled, so data-motion is not yet set here.
    const animate = !reduced;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let shooters: Shooter[] = [];
    let raf = 0;
    let lastSpawn = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(90, Math.min(300, Math.round((w * h) / 8000)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.25,
        base: Math.random() * 0.5 + 0.28,
        amp: Math.random() * 0.4,
        speed: Math.random() * 1.6 + 0.3,
        phase: Math.random() * Math.PI * 2,
        depth: Math.random() * 0.8 + 0.2,
      }));
    };

    const nebula = (xr: number, yr: number, rad: number, hue: string) => {
      const g = ctx.createRadialGradient(w * xr, h * yr, 0, w * xr, h * yr, rad);
      g.addColorStop(0, hue);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const { nx, ny } = mouseStore.current;

      // soft forest glows behind the stars
      nebula(0.2, 0.15, Math.max(w, h) * 0.5, "rgba(111, 174, 119, 0.10)");
      nebula(0.85, 0.75, Math.max(w, h) * 0.55, "rgba(217, 171, 82, 0.07)");

      ctx.fillStyle = "#f6f1e2";
      for (const s of stars) {
        const tw = animate
          ? s.base + Math.sin(t * 0.001 * s.speed + s.phase) * s.amp
          : s.base;
        const px = s.x + (animate ? nx * 12 * s.depth : 0);
        const py = s.y + (animate ? ny * 12 * s.depth : 0);
        ctx.globalAlpha = Math.max(0.05, Math.min(1, tw));
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

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
      shooters = shooters.filter((sh) => {
        sh.life += 16; // ~1 frame at 60fps
        sh.x += sh.vx;
        sh.y += sh.vy;
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

      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      draw(t);
    };

    resize();
    if (animate) {
      mouseStore.start();
      raf = requestAnimationFrame(loop);
    } else {
      draw(0);
    }

    const onResize = () => {
      resize();
      draw(performance.now());
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="starfield-layer pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, var(--sky-1) 0%, var(--sky-2) 45%, var(--sky-3) 100%)" }}
      />
      <div className="dot-grid absolute inset-0" />
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
