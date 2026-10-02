"use client";

import { useCallback, useState } from "react";

/**
 * Tracks which item was just copied, so a list can show a "copied" state on the
 * right row. Copies the text to the clipboard and clears the flag after a beat.
 */
export function useCopy(timeout = 1600) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(
    (id: string, text: string) => {
      navigator.clipboard
        ?.writeText(text)
        .then(() => {
          setCopiedId(id);
          window.setTimeout(() => setCopiedId(null), timeout);
        })
        .catch(() => {
          // clipboard blocked; nothing to do
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
