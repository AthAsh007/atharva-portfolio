import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger, in ms. */
  delay?: number;
  as?: ElementType;
}

/**
 * Marks a subtree for the document-wide reveal observer (see useReveal).
 * Renders its final state by default — motion is opt-in, never opt-out.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  return (
    <Tag
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
