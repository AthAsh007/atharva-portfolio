"use client";

import { useEffect, useRef } from "react";
import { registerTilt } from "@/lib/mouseStore";
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
 * mouseStore.ts — no per-component listeners). Disabled entirely under
 * prefers-reduced-motion: the wrapper then renders flat with no JS.
 */
export function Tilt({ children, className, max = 8 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stop = registerTilt(el, max);
    return () => {
      stop();
      el.style.transform = "";
      el.style.willChange = "";
      el.classList.remove("glow");
    };
  }, [max]);

  return (
    <div ref={ref} data-tilt className={cn("inline-block", className)}>
      {children}
    </div>
  );
}
