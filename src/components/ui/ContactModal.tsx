"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { createPortal } from "react-dom";
import { lockScroll, restoreFocus } from "@/lib/overlay";

interface ContactModalContextValue {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export interface ContactModalPanelProps {
  open: boolean;
  close: () => void;
}

const ContactModalContext = createContext<ContactModalContextValue | undefined>(undefined);

type Panel = ComponentType<ContactModalPanelProps>;

/**
 * Wrap the app with this once (in AppShell). Only the light context lives in
 * the first bundle: the panel itself (form, copy helpers, links) is a separate
 * chunk, fetched when the browser is idle or on the first openModal, whichever
 * comes first, and nothing is added to the DOM until a button asks for it.
 * The panel is a portaled frosted-glass layer with a short brief form (submit
 * opens a pre-filled mailto — no backend required for a static site) plus the
 * Calendly slot link and profile links.
 */
export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [Panel, setPanel] = useState<Panel | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const loading = useRef(false);

  const load = useCallback(() => {
    if (loading.current) return;
    loading.current = true;
    import("./ContactModalPanel").then((m) => setPanel(() => m.ContactModalPanel));
  }, []);

  // prefetch the panel once the page has settled
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = w.requestIdleCallback ? w.requestIdleCallback(load, { timeout: 3000 }) : undefined;
    const timeoutId = idleId === undefined ? window.setTimeout(load, 2000) : undefined;
    return () => {
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [load]);

  // While open: lock page scroll and hand focus back to the opener on every
  // close path (X, overlay, Escape, submit) when the effect tears down.
  useEffect(() => {
    if (!open) return;
    const release = lockScroll();
    return () => {
      release();
      restoreFocus(opener.current);
    };
  }, [open]);

  // The opener is recorded here, before the panel mounts and moves focus into
  // its first field; an effect would run too late and catch the field itself.
  const openModal = useCallback(() => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    load();
    setOpen(true);
  }, [load]);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <ContactModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
      {/* stays mounted once loaded (it renders nothing while closed), so a
          half-written brief survives closing and reopening */}
      {Panel ? createPortal(<Panel open={open} close={closeModal} />, document.body) : null}
    </ContactModalContext.Provider>
  );
}

/** Hook for any CTA button to open the brief modal. */
export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}
