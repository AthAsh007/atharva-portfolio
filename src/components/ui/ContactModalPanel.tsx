"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCopy, isLink } from "@/hooks/useCopy";
import type { ContactModalPanelProps } from "./ContactModal";

interface Form {
  name: string;
  email: string;
  message: string;
}

/* Fields keep 16px on touch (iOS zooms the page into anything smaller) and
   only drop to 14px on a fine pointer. The resting ring is strong enough to
   read as a field (3:1) before it is focused. */
const field =
  "w-full rounded-xl bg-surface-2/60 px-4 py-3 text-[16px] text-ink outline-none ring-1 ring-inset ring-muted/50 placeholder:text-muted focus:ring-2 focus:ring-accent [@media(pointer:fine)]:text-sm";

/**
 * The brief dialog itself, split out of the first bundle (ContactModal.tsx
 * loads it on idle or on the first open).
 */
export function ContactModalPanel({ open, close }: ContactModalPanelProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { copiedId, copy } = useCopy();
  const [form, setForm] = useState<Form>({ name: "", email: "", message: "" });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // the command palette can sit on top of the brief; its Escape is its own
      if (document.querySelector('[aria-label="Command palette"]')) return;
      close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Move focus into the dialog on open. On a fine pointer the first field takes
  // it; on touch the panel itself does, so the keyboard does not pop up uninvited.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector<HTMLInputElement>("input");
    if (first && window.matchMedia("(pointer: fine)").matches) first.focus({ preventScroll: true });
    else panel.focus({ preventScroll: true });
  }, [open]);

  // Keep Tab and Shift+Tab inside the panel.
  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const current = document.activeElement;
    if (e.shiftKey && (current === first || current === panelRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && current === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) close();
  };

  const onField = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    );
    window.location.href = `mailto:${profile.email}?subject=Brief from portfolio&body=${body}`;
    close();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onMouseDown={onOverlayClick}
      className={cn(
        "overlay-enter fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto overscroll-contain bg-[var(--overlay)]",
        "px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-[4px]",
      )}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="brief-title"
        tabIndex={-1}
        onKeyDown={onPanelKeyDown}
        className={cn(
          "modal-enter surface-solid relative my-auto w-full max-w-lg rounded-glass p-6 text-left outline-none sm:p-8",
          "ring-1 ring-accent/30",
        )}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-2 top-2 grid h-11 w-11 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:text-ink sm:right-3 sm:top-3"
        >
          <span aria-hidden className="relative block h-4 w-4">
            <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 rotate-45 rounded-full bg-current" />
            <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
          </span>
        </button>

        <p className="label mb-2">
          <span className="text-accent">05</span> &nbsp;/&nbsp; Contact
        </p>
        <h2 id="brief-title" className="pr-10 font-heading text-h2 uppercase sm:text-h1">
          Send me a brief.
        </h2>
        <p className="mt-2 max-w-measure text-sm text-muted">
          A short note is enough. I reply from <span className="text-ink">{profile.email}</span>, or book a
          30-minute slot directly.
        </p>

        <form className="mt-6 grid gap-s2" onSubmit={onSend}>
          <input
            required
            type="text"
            name="name"
            autoComplete="name"
            aria-label="Your name"
            placeholder="Your name"
            value={form.name}
            onChange={onField("name")}
            className={field}
          />
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            aria-label="Your email"
            placeholder="Your email"
            value={form.email}
            onChange={onField("email")}
            className={field}
          />
          <textarea
            required
            rows={4}
            name="message"
            aria-label="Your message"
            placeholder="What are you building? A line or two is plenty"
            value={form.message}
            onChange={onField("message")}
            className={cn(field, "resize-y")}
          />
          <button
            type="submit"
            className="group inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-body text-small uppercase tracking-[0.14em] text-[var(--on-accent)] transition-[filter,box-shadow] duration-200 hover:brightness-110 hover:shadow-[0_0_24px_4px_rgba(217,171,82,0.45)]"
          >
            Send brief
            <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </button>
        </form>

        <div className="mt-s3 grid grid-cols-1 gap-s2 min-[400px]:grid-cols-2">
          <Button href={profile.booking} target="_blank" rel="noreferrer" variant="secondary" className="px-4">
            Book a slot
          </Button>
          <Button href={`mailto:${profile.email}`} variant="secondary" className="px-4">
            Email me
          </Button>
        </div>

        <ul className="mt-s2 flex flex-wrap gap-x-s2 text-small text-muted">
          {profile.socials.map((s) => {
            const copied = copiedId === s.href;
            return (
              <li key={s.label}>
                {isLink(s.href) ? (
                  <a
                    className="inline-flex min-h-11 items-center px-1 text-muted underline-offset-4 hover:text-accent hover:underline"
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "me noreferrer" : undefined}
                  >
                    {s.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => copy(s.href, s.handle)}
                    className="inline-flex min-h-11 cursor-pointer items-center px-1 text-muted underline-offset-4 hover:text-accent hover:underline"
                  >
                    {copied ? "copied" : s.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
