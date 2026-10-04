"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { nav, profile } from "@/lib/site";
import { useContactModal } from "@/components/ui/ContactModal";
import { Toast } from "@/components/ui/Toast";
import { useTheme } from "@/hooks/useTheme";
import { isLink } from "@/hooks/useCopy";
import { announce, lockScroll, restoreFocus, trackVisualViewport } from "@/lib/overlay";
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
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const toastTimer = useRef(0);
  const { openModal } = useContactModal();
  const { setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // Scroll on the next frame, once the palette has closed and released the
  // scroll lock. Jump instantly under reduced motion.
  const go = useCallback((href: string) => {
    requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.querySelector(href)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  }, []);

  // Copy with feedback: a short toast for the eye, the live region for the ear.
  const copyText = useCallback((text: string, done: string) => {
    const show = (msg: string) => {
      setToast(msg);
      announce(msg);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(null), 2200);
    };
    if (!navigator.clipboard) {
      show("Copy is not available in this browser");
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => show(done),
      () => show("Could not copy"),
    );
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
        run: () => copyText(profile.email, "Email copied"),
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
            else copyText(s.handle, `${s.label} handle copied`);
          },
        };
      }),
    ],
    [go, openModal, setTheme, copyText],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q) || a.hint?.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    // remember what had focus before the palette takes it, so closing can
    // hand it back (an effect after opening would only see the search field)
    const show = () => {
      if (open) return;
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      const typing = ["INPUT", "TEXTAREA"].includes((document.activeElement?.tagName ?? "").toUpperCase());
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) setOpen(false);
        else show();
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        show();
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("cmdk:open", show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("cmdk:open", show);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // While open: lock page scroll, follow the visual viewport (so the list is
  // capped above the iOS keyboard), focus the search field, and give focus
  // back to the opener when the palette closes.
  useEffect(() => {
    if (!open) return;
    const release = lockScroll();
    const untrack = trackVisualViewport();
    inputRef.current?.focus({ preventScroll: true });
    return () => {
      release();
      untrack();
      restoreFocus(opener.current);
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // Keep the arrow-key row in view inside the scrolling list.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!mounted) return null;

  const toastLayer = toast ? <Toast>{toast}</Toast> : null;
  if (!open) return toastLayer;

  // Close first, then run on the next frame: focus is back on the opener by
  // then, so an action that opens the brief records the right element to
  // return to, rather than the palette's detached search field.
  const run = (action?: Action) => {
    setOpen(false);
    setQuery("");
    if (action) requestAnimationFrame(() => action.run());
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

  // Tab stays inside the palette: options are reached with the arrow keys, so
  // Tab simply returns to the search field.
  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    inputRef.current?.focus();
  };

  const activeId = filtered[active] ? optionId(filtered[active].id) : undefined;

  return (
    <>
      {toastLayer}
      {createPortal(
        <div
          className="overlay-enter fixed inset-0 z-[130] flex items-start justify-center overscroll-contain bg-[var(--overlay)] px-4 pt-[max(1rem,env(safe-area-inset-top),10dvh)] backdrop-blur-[3px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={onPanelKeyDown}
            className="surface-solid modal-enter w-full max-w-lg overflow-hidden rounded-glass ring-1 ring-accent/25"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              role="combobox"
              aria-label="Search commands"
              aria-expanded="true"
              aria-controls="cmdk-list"
              aria-autocomplete="list"
              aria-activedescendant={activeId}
              placeholder="Type a command or search..."
              className="w-full border-b border-rule/40 bg-transparent px-5 py-4 text-body text-ink outline-none placeholder:text-muted"
            />

            <ul
              ref={listRef}
              id="cmdk-list"
              role="listbox"
              aria-label="Commands"
              className="max-h-[min(46dvh,calc(var(--vvh,100dvh)-10rem))] overflow-y-auto overscroll-contain py-2"
            >
              {filtered.length === 0 ? (
                <li role="presentation" className="px-5 py-6 text-center text-small text-muted">
                  No matches.
                </li>
              ) : (
                filtered.map((action, i) => (
                  <li key={action.id} role="presentation">
                    <button
                      type="button"
                      id={optionId(action.id)}
                      role="option"
                      aria-selected={i === active}
                      tabIndex={-1}
                      data-index={i}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => run(action)}
                      className={cn(
                        "flex min-h-11 w-full cursor-pointer items-center justify-between gap-s3 px-5 py-3 text-left text-body transition-colors",
                        // the gold bar marks the row; in light theme the label
                        // stays ink so it clears 4.5:1 on the tint
                        i === active
                          ? "bg-accent/15 text-accent shadow-[inset_2px_0_0_var(--accent)] [[data-theme=light]_&]:text-ink"
                          : "text-ink hover:bg-surface-2/40",
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

            <div
              aria-hidden
              className="hidden items-center justify-between border-t border-rule/40 px-5 py-2 text-small uppercase tracking-[0.12em] text-muted [@media(pointer:fine)]:flex"
            >
              <span>&uarr;&darr; navigate &nbsp; &crarr; run</span>
              <span>esc to close</span>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

/** A DOM-safe id for an option (action ids can contain "#", "/" or "@"). */
function optionId(id: string) {
  return `cmdk-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}
