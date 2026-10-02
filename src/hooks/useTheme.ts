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
const listeners = new Set<(t: Theme) => void>();

function applyDom(t: Theme) {
  const root = document.documentElement;
  if (t === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");
}

export function setTheme(t: Theme) {
  current = t;
  applyDom(t);
  try {
    localStorage.setItem("theme", t);
  } catch {
    // storage unavailable; the theme still applies for this session
  }
  listeners.forEach((l) => l(t));
}

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const saved = localStorage.getItem("theme") as Theme | null;
  const system = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  const initial = saved === "light" || saved === "dark" ? saved : system;
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
