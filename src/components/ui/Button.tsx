import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "ghost";
}

/**
 * studio-folio: radius 0, no shadow, no gradient. A button is a hard rectangle
 * that inverts on hover — the accent does the shouting.
 */
export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <a
      {...props}
      className={cn(
        "group inline-flex items-center gap-3 px-6 py-4 font-body text-small uppercase tracking-[0.16em] transition-colors duration-300",
        variant === "primary" && "bg-ink text-paper hover:bg-accent",
        variant === "secondary" && "border border-ink text-ink hover:bg-ink hover:text-paper",
        variant === "ghost" && "border border-night-rule text-paper hover:border-accent hover:text-accent",
        className,
      )}
    >
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        &rarr;
      </span>
    </a>
  );
}
