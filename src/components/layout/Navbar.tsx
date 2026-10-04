"use client";

import { useEffect, useRef, useState } from "react";
import { nav, profile } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { lockScroll } from "@/lib/overlay";

/**
 * A thin floating rail. It gains a glass backing once the hero is behind you,
 * runs a scroll-progress bar at the very top, and carries a sun/moon theme
 * switch. On mobile the links collapse into a menu that drops below the rail.
 */
export function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const barRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  // Scroll work stays off React: the progress bar is written straight to the
  // DOM as a transform once per frame, and `stuck` only re-renders when it flips.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setStuck((prev) => (prev === y > 24 ? prev : y > 24));
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const p = total > 0 ? Math.min(1, y / total) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // While the mobile menu is open: the page behind it is locked, focus moves
  // to the first link, and it closes on Escape (focus back to the toggle), on
  // a tap anywhere outside the rail, or once the viewport grows past the md
  // breakpoint, where the menu no longer exists.
  useEffect(() => {
    if (!open) return;
    const release = lockScroll();
    menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    mq.addEventListener("change", onChange);
    return () => {
      release();
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <>
      <div
        ref={barRef}
        aria-hidden
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-accent/70"
        style={{ transform: "scaleX(0)" }}
      />

      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background-color,border-color,backdrop-filter] duration-300",
          stuck ? "glass-bar" : "border-b border-transparent",
        )}
      >
        <div className="shell flex h-16 items-center justify-between">
          <a href="#top" className="inline-flex min-h-11 items-center font-display text-xl text-accent">
            {profile.shortName}
            <span className="text-accent">.</span>
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-s3 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="label inline-flex min-h-11 items-center transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-s1 sm:gap-s2">
            {/* a keyboard hint, so only where there is a keyboard and a mouse;
                it reads Cmd K on Apple platforms and Ctrl K elsewhere (the
                pre-paint script sets data-apple) */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("cmdk:open"))}
              aria-label="Open command palette"
              className="hidden cursor-pointer items-center gap-1.5 rounded-full border border-rule/50 px-3 py-1.5 text-small text-muted transition-colors hover:border-accent/60 hover:text-accent md:[@media(hover:hover)_and_(pointer:fine)]:inline-flex"
            >
              <span aria-hidden className="font-mono text-[0.7rem] tracking-[0.1em]">
                <span className="hidden [[data-apple]_&]:inline">&#8984;K</span>
                <span className="[[data-apple]_&]:hidden">Ctrl K</span>
              </span>
            </button>

            <ThemeSwitch theme={theme} onChange={setTheme} />

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="label inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-2 text-muted hover:text-accent md:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        <nav
          ref={menuRef}
          id="mobile-nav"
          aria-label="Sections"
          hidden={!open}
          className="glass-bar max-h-[calc(100dvh-4rem-env(safe-area-inset-top))] overflow-y-auto overscroll-contain border-t md:hidden"
        >
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
      className="flex items-center gap-0.5 rounded-full border border-rule/50 p-1 [@media(pointer:fine)]:p-0.5"
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
              // 36px targets (plus an invisible ring) on touch, compact only
              // where the pointer is fine; keyed to the input, not the width
              "relative grid h-9 w-9 cursor-pointer place-items-center rounded-full transition-colors [@media(pointer:fine)]:h-7 [@media(pointer:fine)]:w-7",
              "after:absolute after:-inset-1 [@media(pointer:fine)]:after:hidden",
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
