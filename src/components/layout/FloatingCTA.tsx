"use client";

import { useContactModal } from "@/components/ui/ContactModal";

/**
 * A persistent, always-on contact trigger. A circular coral button with a soft
 * breathing halo that opens the brief modal. Tucked to the corner so it never
 * competes with the rail; the halo is gated on motion so reduced-motion users
 * get a clean, static button.
 */
export function FloatingCTA() {
  const { openModal } = useContactModal();

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
      <div
        aria-hidden
        className="absolute -inset-1.5 rounded-full bg-accent/15"
        data-motion
      />
      <div className="cta-pulse absolute -inset-2.5 rounded-full" />
      <button
        type="button"
        onClick={openModal}
        data-cta
        className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-[var(--on-accent)] shadow-[0_0_24px_4px_rgba(217,171,82,0.4)] transition-transform hover:scale-110 hover:shadow-[0_0_28px_8px_rgba(217,171,82,0.55)]"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <span className="sr-only">Open contact brief</span>
      </button>
    </div>
  );
}
