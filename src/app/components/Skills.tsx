"use client";

import { useEffect, useRef } from "react";
import { toolkit } from "@/lib/site";

/**
 * The toolkit as a carousel of group cards rather than a scrolling word strip.
 * Each card is one lane (Languages, AI, Automation, Product, Infra) with its
 * skills as chips, so the section is readable instead of a blur.
 *
 * It auto-advances slowly, pauses on hover, focus or drag, and can be dragged
 * (desktop) or swiped (touch). Arrow buttons scroll it too. The list is
 * duplicated and scrollLeft wraps at the midpoint for a seamless loop. All of
 * this is off under reduced motion, where it is a plain scrollable row.
 */
export function Skills() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let paused = false;
    let dragging = false;
    let startX = 0;
    let startLeft = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (paused) return;
      const half = el.scrollWidth / 2;
      el.scrollLeft += 0.55;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
    };

    const onEnter = () => (paused = true);
    const onLeave = () => {
      if (!dragging) paused = false;
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      paused = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      paused = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const onFocusIn = () => (paused = true);
    const onFocusOut = () => {
      if (!dragging) paused = false;
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const nudge = (dir: number) => ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  return (
    <section aria-label="Toolkit" className="py-s5">
      {/* thin tech ticker */}
      <div className="mb-s4 overflow-hidden border-y border-rule/30 py-2">
        <div className="marquee-track flex w-max items-center whitespace-nowrap">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex items-center">
              {toolkit.flatMap((g) => g.items).map((item) => (
                <li
                  key={`${copy}-${item}`}
                  className="mr-s3 flex items-center gap-s3 font-mono text-small uppercase tracking-[0.16em] text-muted"
                >
                  {item}
                  <span aria-hidden className="text-accent">
                    /
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="shell flex items-end justify-between gap-s3">
        <div>
          <p className="label">
            <span className="text-accent">~</span> &nbsp;/&nbsp; Toolkit
          </p>
          <h2 className="mt-s1 font-heading text-h2 tracking-tight">What I build with.</h2>
        </div>

        <div className="flex gap-2">
          <CarouselButton label="Scroll left" onClick={() => nudge(-1)}>
            &larr;
          </CarouselButton>
          <CarouselButton label="Scroll right" onClick={() => nudge(1)}>
            &rarr;
          </CarouselButton>
        </div>
      </div>

      <div
        ref={ref}
        tabIndex={0}
        className="no-scrollbar mt-s4 flex cursor-grab select-none gap-s2 overflow-x-auto pb-2 active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]"
      >
        {[...toolkit, ...toolkit].map((group, i) => (
          <article
            key={`${group.group}-${i}`}
            aria-hidden={i >= toolkit.length}
            className="liquid-glass flex w-[80vw] shrink-0 flex-col gap-s2 rounded-[22px] p-s3 sm:w-[300px]"
          >
            <span className="label text-accent">
              {String((i % toolkit.length) + 1).padStart(2, "0")}
            </span>
            <h3 className="font-heading text-h3">{group.group}</h3>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-rule/50 px-3 py-1 text-small text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-rule/50 text-muted transition-colors hover:border-accent/60 hover:text-accent"
    >
      {children}
    </button>
  );
}
