"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/**
 * A module-level theme store so every consumer (the nav switch, the command
 * palette) reads and writes the same value. Forest night is the default, so the
 * dark canvas needs no attribute; light is opt-in via data-theme="light". The
 * choice is persisted and falls back to the system preference on first visit.
 */
let current: Theme = "dark";
let initialized = false;
let switchTimer = 0;
const listeners = new Set<(t: Theme) => void>();

/** Browser chrome colour for each theme (mirrors --paper). */
const CHROME = { dark: "#0b2a19", light: "#f5f1e6" } as const;

function applyDom(t: Theme) {
  const root = document.documentElement;
  if (t === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");
  // the address bar follows the chosen theme, not only the OS setting
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute("content", CHROME[t]));
}

export function setTheme(t: Theme) {
  current = t;
  // the colour fade in globals.css only applies while this class is on, so
  // the first paint and every hover keep their own transitions
  const root = document.documentElement;
  root.classList.add("theme-switching");
  window.clearTimeout(switchTimer);
  switchTimer = window.setTimeout(() => root.classList.remove("theme-switching"), 350);
  applyDom(t);
  try {
    localStorage.setItem("theme", t);
  } catch {
    // storage unavailable; the theme still applies for this session
  }
  listeners.forEach((l) => l(t));
}

/**
 * The blocking script in layout.tsx <head> already set data-theme before first
 * paint, so trust the attribute when it is there and only recompute as a
 * fallback (script blocked or missing).
 */
function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const root = document.documentElement;
  let initial: Theme;
  if (root.dataset.theme === "light") {
    initial = "light";
  } else {
    let saved: Theme | null = null;
    try {
      saved = localStorage.getItem("theme") as Theme | null;
    } catch {
      // storage unavailable; fall back to the system preference
    }
    const system = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    initial = saved === "light" || saved === "dark" ? saved : system;
  }
  current = initial;
  applyDom(initial);
}

export function useTheme() {
  const [theme, setLocal] = useState<Theme>(current);

  useEffect(() => {
    init();
    setLocal(current);
    const listener = (t: Theme) => setLocal(t);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    theme,
    setTheme,
    toggle: () => setTheme(current === "light" ? "dark" : "light"),
  };
}
