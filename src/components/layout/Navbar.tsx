"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * A thin rail rather than a nav bar — studio-folio has no centred SaaS chrome.
 * It picks up a hairline and a paper backing once the hero is behind you.
 */
export function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        stuck ? "border-b border-rule bg-paper" : "border-b border-transparent",
      )}
    >
      <div className="shell flex h-20 items-center justify-between">
        <a href="#top" className="font-heading text-h3 tracking-tight">
          {profile.name}
          <span className="text-accent">.</span>
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-s3 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="label transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="label md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Sections" className="border-t border-rule bg-paper md:hidden">
          <ul className="shell flex flex-col py-s2">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-rule py-s2 font-heading text-h3"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
