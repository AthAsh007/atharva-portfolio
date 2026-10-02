"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { nav, profile } from "@/lib/site";
import { useContactModal } from "@/components/ui/ContactModal";
import { useTheme } from "@/hooks/useTheme";
import { isLink } from "@/hooks/useCopy";
import { cn } from "@/lib/utils";

interface Action {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
}

/**
 * A ⌘K command palette. Opens on Cmd/Ctrl+K, on "/", or from the nav hint
 * button. Filter the list by typing, move with the arrow keys, run with Enter.
 * It is the one control that reaches every action on the page: jump to a
 * section, open the brief, download the CV, copy the email, switch theme, or
 * open a profile.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const { openModal } = useContactModal();
  const { setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const go = useCallback((href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const actions = useMemo<Action[]>(
    () => [
      ...nav.map((n) => ({
        id: `nav-${n.href}`,
        label: `Go to ${n.label}`,
        hint: "Jump",
        run: () => go(n.href),
      })),
      { id: "brief", label: "Send a brief", hint: "Contact", run: openModal },
      {
        id: "cv",
        label: "Download CV",
        hint: "PDF",
        run: () => {
          const a = document.createElement("a");
          a.href = "/Atharva-Ashtekar-CV.pdf";
          a.download = "";
          a.click();
        },
      },
      {
        id: "copy",
        label: "Copy email address",
        hint: profile.email,
        run: () => navigator.clipboard?.writeText(profile.email),
      },
      { id: "light", label: "Switch to light theme", hint: "Theme", run: () => setTheme("light") },
      { id: "dark", label: "Switch to dark theme", hint: "Theme", run: () => setTheme("dark") },
      ...profile.socials.map((s) => {
        const link = isLink(s.href);
        return {
          id: `social-${s.href}`,
          label: link ? `Open ${s.label}` : `Copy ${s.label} handle`,
          hint: s.handle,
          run: () => {
            if (link) window.open(s.href, s.href.startsWith("http") ? "_blank" : "_self");
            else navigator.clipboard?.writeText(s.handle);
          },
        };
      }),
    ],
    [go, openModal, setTheme],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q) || a.hint?.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      const typing = ["INPUT", "TEXTAREA"].includes((document.activeElement?.tagName ?? "").toUpperCase());
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("cmdk:open", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("cmdk:open", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => setActive(0), [query]);

  if (!mounted || !open) return null;

  const run = (action?: Action) => {
    action?.run();
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (filtered.length ? (a + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (filtered.length ? (a - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(filtered[active]);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[130] flex items-start justify-center bg-[var(--overlay)] px-4 pt-[14vh] backdrop-blur-[3px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="surface-solid modal-enter w-full max-w-lg overflow-hidden rounded-[20px] ring-1 ring-accent/25">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a command or search..."
          className="w-full border-b border-rule/40 bg-transparent px-5 py-4 text-body text-ink outline-none placeholder:text-muted"
        />

        <ul className="max-h-[46vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <li className="px-5 py-6 text-center text-small text-muted">No matches.</li>
          ) : (
            filtered.map((action, i) => (
              <li key={action.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(action)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-s3 px-5 py-3 text-left text-body transition-colors",
                    i === active ? "bg-accent/15 text-accent" : "text-ink hover:bg-surface-2/40",
                  )}
                >
                  <span>{action.label}</span>
                  {action.hint ? (
                    <span className="truncate text-small uppercase tracking-[0.12em] text-muted">
                      {action.hint}
                    </span>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-rule/40 px-5 py-2 text-small uppercase tracking-[0.12em] text-muted">
          <span>&uarr;&darr; navigate &nbsp; &crarr; run</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
