"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { profile } from "@/lib/site";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * A quiet easter egg. Logs a greeting to the console for anyone who opens
 * devtools, and watches for the Konami code on the page: on the match it drops
 * a small toast inviting them to get in touch. Nothing else changes.
 */
export function EasterEgg() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      "%cAtharva Ashtekar",
      "font: 600 15px system-ui; color: #d9ab52;",
      `\nYou opened the console. Try the Konami code on the page, or press Cmd/Ctrl+K for the command palette. Reach me at ${profile.email}.`,
    );

    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === KONAMI[idx]) {
        idx += 1;
        if (idx === KONAMI.length) {
          idx = 0;
          setShow(true);
          window.setTimeout(() => setShow(false), 6500);
        }
      } else {
        idx = k === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!show) return null;

  return createPortal(
    <div className="toast-in liquid-glass fixed bottom-6 left-1/2 z-[140] -translate-x-1/2 rounded-full px-5 py-3 text-small text-ink">
      You found the shortcut. &nbsp;
      <a href={`mailto:${profile.email}`} className="text-accent underline underline-offset-4">
        Let&apos;s build something.
      </a>
    </div>,
    document.body,
  );
}
