"use client";

import { useEffect, useRef, useState } from "react";
import { toolkit } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Auto-advance speed, in px per second (frame-rate independent). */
const SPEED = 33;

/**
 * The toolkit as a carousel of group cards rather than a scrolling word strip.
 * Each card is one lane (Languages, AI, Automation, Product, Infra) with its
 * skills as chips, so the section is readable instead of a blur.
 *
 * It auto-advances slowly while on screen, pauses on hover, focus or drag, and
 * can be dragged (mouse) or swiped (touch, native scrolling). Arrow buttons
 * scroll it too, and a pause control stops both it and the ticker above. The
 * list is repeated as many times as the viewport needs (at least twice, more
 * on ultrawide screens) and scrollLeft wraps after one set, for a seamless
 * loop at any width. All of this is off under reduced motion, where it is a
 * plain scrollable row that snaps card by card.
 */
export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const [held, setHeld] = useState(false);
  // the effect reads the pause control through this, without restarting
  const control = useRef<{ held: boolean; sync: () => void; hold: (ms: number) => void }>({
    held: false,
    sync: () => {},
    hold: () => {},
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = 0;
    let paused = false;
    let dragging = false;
    let visible = false;
    let startX = 0;
    let startLeft = 0;
    let resumeTimer = 0;
    // float accumulator: at DPR 1 browsers round scrollLeft to whole pixels,
    // so adding a fraction straight to scrollLeft can stall the carousel.
    let pos = el.scrollLeft;
    // one set's exact width (card plus gap, times the lane count), measured
    // from the first card of the second copy so the inline padding is ignored
    let half = 0;

    const measure = () => {
      const first = el.children[0] as HTMLElement | undefined;
      const second = el.children[toolkit.length] as HTMLElement | undefined;
      if (!first || !second) return;
      half = second.offsetLeft - first.offsetLeft;
      // enough copies that the row never runs out before the wrap point,
      // including on 2560px+ screens where two sets are narrower than the view
      const need = Math.max(2, Math.ceil(el.clientWidth / half) + 1);
      if (need !== copies) setCopies(need);
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(t - last, 50) : 16;
      last = t;
      if (!half) return;
      // resync if something else (swipe, keyboard, arrow nudge) moved it. The
      // clamp means a scrollLeft held short by the scroll range can never trap
      // the loop below the wrap point.
      if (Math.abs(el.scrollLeft - pos) > 1) pos = Math.min(el.scrollLeft, half - 1);
      pos += (SPEED * dt) / 1000;
      if (pos >= half) pos -= half;
      el.scrollLeft = pos;
    };

    // runs only while visible, on screen, not hovered/focused/dragged, and not
    // stopped by the pause control; otherwise no frame is scheduled at all
    const sync = () => {
      const run = visible && !document.hidden && !paused && !control.current.held;
      if (run && !raf) {
        pos = el.scrollLeft;
        last = 0;
        raf = requestAnimationFrame(loop);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    control.current.sync = sync;

    const setPaused = (v: boolean) => {
      paused = v;
      sync();
    };

    const resumeLater = (ms: number) => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        if (!dragging) setPaused(false);
      }, ms);
    };

    // an arrow nudge is a smooth scrollBy; writing scrollLeft from the loop
    // would abort it, so stand still until it has had time to land
    control.current.hold = (ms: number) => {
      setPaused(true);
      resumeLater(ms);
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") setPaused(true);
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && !dragging) setPaused(false);
    };
    const onDown = (e: PointerEvent) => {
      window.clearTimeout(resumeTimer);
      setPaused(true);
      // touch and pen use native scrolling (keeps momentum and vertical page swipes)
      if (e.pointerType !== "mouse") return;
      dragging = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") {
        // let native momentum finish before auto-advance takes over again
        resumeLater(1500);
        return;
      }
      if (!dragging) return;
      dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      // still over the row after a drag, so stay paused until the pointer leaves
      setPaused(el.matches(":hover"));
    };
    const onFocusIn = () => setPaused(true);
    const onFocusOut = () => {
      if (!dragging) setPaused(false);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.clearTimeout(resumeTimer);
      control.current.sync = () => {};
      control.current.hold = () => {};
      document.removeEventListener("visibilitychange", sync);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, [copies]);

  const toggleHeld = () => {
    const next = !held;
    setHeld(next);
    control.current.held = next;
    control.current.sync();
  };

  const nudge = (dir: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    control.current.hold(700);
    ref.current?.scrollBy({ left: dir * 300, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-label="Toolkit" className="py-s5">
      {/* thin tech ticker */}
      <div className="mb-s4 overflow-hidden border-y border-rule/30 py-2">
        <div
          className="marquee-track flex w-max items-center whitespace-nowrap"
          data-paused={held ? "" : undefined}
        >
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

      <div className="shell flex flex-col gap-s2 sm:flex-row sm:items-end sm:justify-between sm:gap-s3">
        <div>
          <p className="label">
            <span className="text-accent">~</span> &nbsp;/&nbsp; Toolkit
          </p>
          <h2 className="mt-s1 font-heading text-h2 tracking-tight">What I build with.</h2>
        </div>

        <div className="flex gap-2">
          {/* stops the ticker and the carousel (WCAG 2.2.2); nothing moves
              under reduced motion, so it is not shown there */}
          <CarouselButton
            label="Pause toolkit motion"
            pressed={held}
            onClick={toggleHeld}
            className="motion-reduce:hidden"
          >
            {held ? <PlayIcon /> : <PauseIcon />}
          </CarouselButton>
          <CarouselButton label="Scroll left" onClick={() => nudge(-1)}>
            &larr;
          </CarouselButton>
          <CarouselButton label="Scroll right" onClick={() => nudge(1)}>
            &rarr;
          </CarouselButton>
        </div>
      </div>

      {/* Inline padding lines the first card up with the shell gutter above
          (and clears the notch in landscape). The edge fade is lifted while
          the row has keyboard focus, so its focus ring is not masked away. */}
      <div
        ref={ref}
        tabIndex={0}
        role="region"
        aria-label="Toolkit carousel"
        className={cn(
          "no-scrollbar mt-s4 flex cursor-grab select-none gap-s2 overflow-x-auto overscroll-x-contain pb-2 [touch-action:pan-x_pan-y] active:cursor-grabbing",
          "px-[max(1.25rem,env(safe-area-inset-left))] scroll-px-[max(1.25rem,env(safe-area-inset-left))] sm:px-8 sm:scroll-px-8",
          "lg:px-[max(3rem,calc((100%-88rem)/2+3rem))] lg:scroll-px-[max(3rem,calc((100%-88rem)/2+3rem))]",
          "[mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)] focus-visible:outline-offset-[-2px] focus-visible:[mask-image:none]",
          "motion-reduce:snap-x motion-reduce:snap-mandatory",
        )}
      >
        {Array.from({ length: copies }, () => toolkit)
          .flat()
          .map((group, i) => (
            <article
              key={`${group.group}-${i}`}
              aria-hidden={i >= toolkit.length}
              className="liquid-glass flex w-[80vw] shrink-0 snap-start flex-col gap-s2 rounded-glass p-s3 sm:w-[300px]"
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
  pressed,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        "grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-rule/50 text-muted transition-colors hover:border-accent/60 hover:text-accent",
        className,
      )}
    >
      {children}
    </button>
  );
}

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <rect x="2" y="1.5" width="2.5" height="9" rx="0.75" />
      <rect x="7.5" y="1.5" width="2.5" height="9" rx="0.75" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M3 1.8v8.4a.6.6 0 0 0 .9.5l7-4.2a.6.6 0 0 0 0-1L3.9 1.3a.6.6 0 0 0-.9.5Z" />
    </svg>
  );
}
