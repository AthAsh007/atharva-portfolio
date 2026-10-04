"use client";

import { useCallback, useState } from "react";
import { announce } from "@/lib/overlay";

/**
 * Tracks which item was just copied, so a list can show a "copied" state on the
 * right row. Copies the text to the clipboard and clears the flag after a beat.
 * The result is also spoken through the shared live region, since the visual
 * text swap alone never reaches a screen reader.
 */
export function useCopy(timeout = 1600) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(
    (id: string, text: string) => {
      if (!navigator.clipboard) {
        announce("Copy is not available in this browser");
        return;
      }
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedId(id);
          announce("Copied");
          window.setTimeout(() => setCopiedId(null), timeout);
        })
        .catch(() => {
          announce("Could not copy");
        });
    },
    [timeout],
  );

  return { copiedId, copy };
}

/** True when a social entry is a real link rather than a copyable handle. */
export function isLink(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:");
}
