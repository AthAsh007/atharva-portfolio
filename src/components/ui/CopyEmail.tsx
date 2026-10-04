"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { announce } from "@/lib/overlay";

/**
 * Copies the email to the clipboard and swaps its label to a "Copied" state
 * with a small pop. The visible text is the accessible name, so the swap is
 * real for screen readers too, and the result is also spoken through the
 * shared live region. If the clipboard API is blocked, the mailto link beside
 * it still works.
 */
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      announce("Email address copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      announce("Could not copy. Use the email link instead");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-rule/50 px-4 py-2.5 text-small uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent/60 hover:text-accent",
        className,
      )}
    >
      <span className={cn(copied && "copy-pop")}>{copied ? "Copied" : "Copy email"}</span>
      <span aria-hidden className="text-accent">
        {copied ? "✓" : "⧉"}
      </span>
    </button>
  );
}
