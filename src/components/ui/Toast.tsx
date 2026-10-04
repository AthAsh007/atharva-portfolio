"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * A small liquid-glass toast pinned to the bottom centre. Centred by a flex
 * wrapper rather than a translate, so the toast-in keyframes never fight the
 * centring and it does not slide in off-centre. Purely visual: pair it with
 * announce() for screen readers.
 */
export function Toast({ children }: { children: ReactNode }) {
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[140] flex justify-center px-4">
      <div className="toast-in liquid-glass pointer-events-auto max-w-full rounded-full px-5 py-3 text-small text-ink">
        {children}
      </div>
    </div>,
    document.body,
  );
}
