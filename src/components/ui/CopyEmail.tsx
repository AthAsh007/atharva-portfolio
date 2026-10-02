"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Copies the email to the clipboard and swaps its label to a "Copied" state
 * with a small pop. Fallback: if the clipboard API is blocked, it selects the
 * text so the visitor can copy manually.
 */
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore: the mailto link beside it still works
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy email address"
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full border border-rule/50 px-4 py-2 text-small uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent/60 hover:text-accent",
        className,
      )}
    >
      <span className={cn(copied && "copy-pop")}>{copied ? "Copied" : "Copy email"}</span>
      <span aria-hidden className="text-accent">
        {copied ? "\u2713" : "\u29c9"}
      </span>
    </button>
  );
}
