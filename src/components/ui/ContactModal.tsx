"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { profile } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCopy, isLink } from "@/hooks/useCopy";

interface ContactModalContextValue {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextValue | undefined>(undefined);

/**
 * Wrap the app with this once (in AppShell). Renders the modal panel lazily —
 * nothing is added to the DOM until a button asks for it, so it costs nothing
 * when closed. The panel is a portaled frosted-glass layer with a short brief
 * form (submit opens a pre-filled mailto — no backend required for a static
 * site) plus the Calendly slot link and profile links.
 */
export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const previously = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        previously.current?.focus();
        setOpen(false);
      }
    };
    if (open) {
      previously.current = document.activeElement as HTMLElement | null;
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "clip";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, mounted]);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <ContactModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
      {mounted ? createPortal(<ContactModalPanel open={open} close={closeModal} />, document.body) : null}
    </ContactModalContext.Provider>
  );
}

/** Hook for any CTA button to open the brief modal. */
export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}

interface Form {
  name: string;
  email: string;
  message: string;
}

function ContactModalPanel({ open, close }: { open: boolean; close: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { copiedId, copy } = useCopy();
  const [form, setForm] = useState<Form>({ name: "", email: "", message: "" });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

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
        "fixed inset-0 z-[120] flex items-center justify-center bg-[var(--overlay)]",
        "backdrop-blur-[4px]",
        "data-[motion]:duration-300",
        open ? "modal-enter" : "",
      )}
    >
      <div
        data-motion
        className={cn(
          "surface-solid relative mx-4 w-full max-w-lg rounded-[22px] p-8 text-left",
          "ring-1 ring-accent/30",
        )}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted opacity-60 hover:opacity-100"
        >
          <span aria-hidden className="block h-5 w-5 rotate-45 rounded-sm bg-ink" />
        </button>

        <p className="label mb-2">
          <span className="text-accent">05</span> &nbsp;/&nbsp; Contact
        </p>
        <h2 className="font-heading text-h1 uppercase">Send me a brief.</h2>
        <p className="mt-2 max-w-measure text-sm text-muted">
          A short note is enough. I reply from <span className="text-ink">{profile.email}</span>, or book a
          30-minute slot directly.
        </p>

        <form className="mt-6 grid gap-s2" onSubmit={onSend}>
          <input
            required
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={onField("name")}
            className="w-full rounded-xl bg-surface-2/60 px-4 py-3 text-sm text-ink outline-none ring-1 ring-inset ring-rule focus-within:ring-accent"
          />
          <input
            required
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={onField("email")}
            className="w-full rounded-xl bg-surface-2/60 px-4 py-3 text-sm text-ink outline-none ring-1 ring-inset ring-rule focus-within:ring-accent"
          />
          <textarea
            required
            rows={4}
            placeholder="What are you building? A line or two is plenty"
            value={form.message}
            onChange={onField("message")}
            className="w-full resize-y rounded-xl bg-surface-2/60 px-4 py-3 text-sm text-ink outline-none ring-1 ring-inset ring-rule focus-within:ring-accent"
          />
          <button
            type="submit"
            className="btn-submit group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-body text-small uppercase tracking-[0.14em] text-[var(--on-accent)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_24px_4px_rgba(217,171,82,0.45)]"
          >
            Send brief
            <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </button>
        </form>

        <div className="mt-s3 grid grid-cols-2 gap-s2">
          <Button
            href={profile.booking}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            className="glass-panel text-xs"
          >
            Book a slot
          </Button>
          <Button href={`mailto:${profile.email}`} variant="secondary" className="glass-panel text-xs">
            Email me
          </Button>
        </div>

        <ul className="mt-s3 flex flex-wrap gap-s2 text-small text-muted">
          {profile.socials.map((s) => {
            const copied = copiedId === s.href;
            return (
              <li key={s.label}>
                {isLink(s.href) ? (
                  <a
                    className="text-muted underline-offset-4 hover:text-accent hover:underline"
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
                    className="cursor-pointer text-muted underline-offset-4 hover:text-accent hover:underline"
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
