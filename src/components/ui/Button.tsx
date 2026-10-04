"use client";

import {
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type Ref,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

/** With an href it is a link. */
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: Variant };
/** Without one it is a real <button>: the CTAs that open the brief dialog. */
type ActionProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  href?: undefined;
  variant?: Variant;
};

type ButtonProps = LinkProps | ActionProps;

/**
 * forest-gold buttons: radius 16px. Primary is a gold-to-moss gradient that
 * glows on hover; secondary and ghost are glass. Every button is magnetic on
 * pointer-fine devices: it leans toward the cursor and springs back on leave.
 * Disabled under reduced motion, where it behaves as a plain link.
 *
 * Renders an <a> when given an href and a <button type="button"> otherwise, so
 * a CTA that opens a dialog is announced, focused and activated (Space too) as
 * a button, and middle-click never opens a useless "#".
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", className, children, ...rest } = props;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // the layer is only promoted while the cursor is on it, not for the
    // lifetime of every CTA on the page
    const onEnter = () => {
      el.style.willChange = "transform";
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.16}px, ${dy * 0.24}px)`;
    };
    const onLeave = () => {
      el.style.transform = "";
      el.style.willChange = "";
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const classes = cn(
    "group inline-flex items-center justify-center gap-3 px-6 py-3.5 font-body text-small uppercase tracking-[0.14em]",
    "cursor-pointer rounded-2xl transition-[transform,box-shadow,color] duration-200 ease-spring",
    variant === "primary" &&
      "bg-gradient-to-r from-accent to-accent-2 text-[var(--on-accent)] hover:shadow-[0_0_28px_6px_rgba(217,171,82,0.4)]",
    variant === "secondary" && "glass-panel text-ink hover:text-accent",
    variant === "ghost" && "text-muted hover:text-accent underline underline-offset-4",
    className,
  );

  const content = (
    <>
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
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a ref={ref as Ref<HTMLAnchorElement>} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes}>
        {content}
      </a>
    );
  }

  const { href: _href, ...buttonRest } = rest as ActionProps;
  return (
    <button ref={ref as Ref<HTMLButtonElement>} type="button" {...buttonRest} className={classes}>
      {content}
    </button>
  );
}
