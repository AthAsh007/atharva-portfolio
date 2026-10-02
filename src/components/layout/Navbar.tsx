"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

/**
 * A thin floating rail. It gains a glass backing once the hero is behind you,
 * runs a scroll-progress bar at the very top, and carries a sun/moon theme
 * switch. On mobile the links collapse into a menu that drops below the rail.
 */
export function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setStuck(y > 24);
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? Math.min(100, (y / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className="fixed left-0 top-0 z-50 h-0.5 bg-accent/70"
        style={{ width: `${progress}%` }}
      />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          stuck ? "glass-bar" : "border-b border-transparent",
        )}
      >
        <div className="shell flex h-16 items-center justify-between">
          <a href="#top" className="font-display text-xl text-accent">
            {profile.shortName}
            <span className="text-accent">.</span>
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-s3 md:flex">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="label transition-colors hover:text-accent">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-s2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("cmdk:open"))}
              aria-label="Open command palette"
              className="hidden cursor-pointer items-center gap-1.5 rounded-full border border-rule/50 px-3 py-1.5 text-small text-muted transition-colors hover:border-accent/60 hover:text-accent md:inline-flex"
            >
              <span aria-hidden className="font-mono text-[0.7rem] tracking-[0.1em]">
                &#8984;K
              </span>
            </button>

            <ThemeSwitch theme={theme} onChange={setTheme} />

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="label cursor-pointer text-muted hover:text-accent md:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {open ? (
          <nav id="mobile-nav" aria-label="Sections" className="glass-bar border-t md:hidden">
            <ul className="shell flex flex-col py-s2">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-rule/40 py-s2 font-heading text-h3"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>
    </>
  );
}

/**
 * A two-option sun/moon switch. Both options are visible buttons and the active
 * one is filled, so the control reads as a switch rather than a mystery icon.
 */
function ThemeSwitch({ theme, onChange }: { theme: "dark" | "light"; onChange: (t: "dark" | "light") => void }) {
  const options = [
    { value: "light" as const, label: "Light theme", icon: <SunIcon /> },
    { value: "dark" as const, label: "Dark theme", icon: <MoonIcon /> },
  ];
  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="flex items-center gap-0.5 rounded-full border border-rule/50 p-0.5"
    >
      {options.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            aria-label={opt.label}
            title={opt.label}
            className={cn(
              "grid h-7 w-7 cursor-pointer place-items-center rounded-full transition-colors",
              active ? "bg-accent text-[var(--on-accent)]" : "text-muted hover:text-accent",
            )}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}
