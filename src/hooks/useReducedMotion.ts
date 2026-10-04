"use client";

import { useSyncExternalStore } from "react";

/**
 * Live prefers-reduced-motion. Unlike a one-off matchMedia read at mount, this
 * re-renders when the visitor flips the OS setting mid-session, so effects that
 * list it as a dependency tear down and re-run in the right mode.
 * Server snapshot is `true` (static-first): nothing animates before hydration.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}
