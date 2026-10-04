"use client";

import { useEffect, useRef } from "react";
import { registerTilt } from "@/lib/mouseStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface TiltProps {
  /** Content to tilt. */
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt angle in degrees. */
  max?: number;
}

/**
 * Wraps any element in a 3D hover tilt driven by the shared mouse loop (see
 * mouseStore.ts, no per-component listeners). Only registers on a real hover
 * pointer: touch devices and prefers-reduced-motion get the flat wrapper with
 * no JS work at all.
 */
export function Tilt({ children, className, max = 8 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const stop = registerTilt(el, max);
    return () => {
      stop();
      el.style.transform = "";
      el.style.willChange = "";
      el.classList.remove("glow");
    };
  }, [max, reduced]);

  return (
    <div ref={ref} data-tilt className={cn("inline-block", className)}>
      {children}
    </div>
  );
}
