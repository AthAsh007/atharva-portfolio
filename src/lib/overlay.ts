"use client";

/**
 * Small shared helpers for the overlays (brief modal, command palette, mobile
 * menu) and for feedback that has to reach assistive tech.
 */

let locks = 0;
let prevHtml = "";
let prevBody = "";

/**
 * Locks page scroll (on <html> as well as <body>, which is what iOS Safari
 * honours) and returns the release. Counted, so the palette opened on top of
 * the modal does not hand scroll back while the modal is still up. The
 * scrollbar gutter is reserved in globals.css, so nothing shifts sideways.
 */
export function lockScroll() {
  const html = document.documentElement;
  if (locks === 0) {
    prevHtml = html.style.overflow;
    prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
  locks += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    }
  };
}

/** Hands focus back to an opener, if it is still in the document. */
export function restoreFocus(el: HTMLElement | null) {
  if (el?.isConnected) el.focus({ preventScroll: true });
}

/**
 * Tracks the visual viewport height in a --vvh custom property while an
 * overlay is open. iOS never resizes the layout viewport for the on-screen
 * keyboard, so dvh alone would leave the bottom of a dialog under it.
 */
export function trackVisualViewport() {
  const vv = window.visualViewport;
  const root = document.documentElement;
  if (!vv) return () => {};
  const write = () => root.style.setProperty("--vvh", `${Math.round(vv.height)}px`);
  write();
  vv.addEventListener("resize", write);
  return () => {
    vv.removeEventListener("resize", write);
    root.style.removeProperty("--vvh");
  };
}

/**
 * Speaks a short status message through the shared polite live region that
 * AppShell renders (#sr-status). Cleared first so the same message twice in a
 * row is still announced.
 */
export function announce(message: string) {
  const region = document.getElementById("sr-status");
  if (!region) return;
  region.textContent = "";
  window.setTimeout(() => {
    region.textContent = message;
  }, 60);
}
