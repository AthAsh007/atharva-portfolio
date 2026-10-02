"use client";

import { useEffect, useRef, type AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "ghost";
}

/**
 * forest-gold buttons: radius 16px. Primary is a gold-to-moss gradient that
 * glows on hover; secondary and ghost are glass. Every button is magnetic on
 * pointer-fine devices: it leans toward the cursor and springs back on leave.
 * Disabled under reduced motion, where it behaves as a plain link.
 */
export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.16}px, ${dy * 0.24}px)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <a
      ref={ref}
      {...props}
      className={cn(
        "group inline-flex items-center justify-center gap-3 px-6 py-3.5 font-body text-small uppercase tracking-[0.14em] transition-all duration-200 ease-spring",
        "rounded-2xl will-change-transform",
        variant === "primary" &&
          "bg-gradient-to-r from-accent to-accent-2 text-[var(--on-accent)] hover:shadow-[0_0_28px_6px_rgba(217,171,82,0.4)]",
        variant === "secondary" &&
          "glass-panel text-ink hover:text-accent",
        variant === "ghost" && "text-muted hover:text-accent underline underline-offset-4",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "transition-transform duration-300 group-hover:translate-x-1",
          variant === "ghost" && "hidden",
        )}
      >
        &rarr;
      </span>
    </a>
  );
}
