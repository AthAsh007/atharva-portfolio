"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useContactModal } from "@/components/ui/ContactModal";
import { LocalClock } from "@/components/ui/LocalClock";
import { mouse, mouseStore } from "@/lib/mouseStore";

/**
 * The hero is one large liquid-glass sheet on the starfield. It is sized to the
 * viewport (min-h) and its content is kept compact (a wrapped role row, a short
 * statement, then the CTAs) so the buttons land inside the glass on screen
 * rather than below the fold. Inside: a meta rule, the masthead (filled first
 * name, outlined surname, drifting on cursor parallax), and the register.
 */
export function Hero() {
  const { openModal } = useContactModal();
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.documentElement.getAttribute("data-motion")) return;
    const el = nameRef.current;
    if (!el) return;
    mouseStore.start();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      el.style.transform = `translate3d(${mouse.nx * 12}px, ${mouse.ny * 9}px, 0)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative flex min-h-screen items-stretch pt-20 pb-s3">
      <div className="shell w-full">
        <div className="liquid-glass flex min-h-[calc(100vh-7rem)] flex-col justify-between rounded-[28px] p-s2 sm:p-s3 lg:p-s4">
          {/* meta rule */}
          <div className="flex flex-wrap items-center justify-between gap-s2 border-b border-rule/40 pb-s2">
            <Reveal>
              <p className="label">
                <span className="text-accent">00</span> &nbsp;/&nbsp; {profile.name} &nbsp;/&nbsp; {new Date().getFullYear()}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex items-center gap-s2">
                <p className="hidden items-center gap-2 text-small text-muted sm:inline-flex">
                  <LocalClock />
                </p>
                <p className="inline-flex items-center gap-2 rounded-full border border-rule/50 px-3 py-1 text-small text-muted">
                  <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
                  {profile.availability}
                </p>
              </div>
            </Reveal>
          </div>

          {/* masthead */}
          <div ref={nameRef} className="py-s2 will-change-transform">
            <h1 className="font-display leading-[0.85]">
              <span className="block text-[clamp(2.5rem,9vw,6.5rem)] text-ink">Atharva</span>
              <span className="text-outline block text-[clamp(2.5rem,9vw,6.5rem)]">Ashtekar</span>
            </h1>
          </div>

          {/* register */}
          <div>
            <div className="border-t border-rule/40 pt-s2">
              <ul className="flex flex-wrap gap-x-s3 gap-y-1">
                {profile.roles.map((role, i) => (
                  <Reveal as="li" key={role} delay={i * 60} className="flex items-baseline gap-2">
                    <span className="label text-accent">0{i + 1}</span>
                    <span className="font-heading text-h3 tracking-tight">{role}</span>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={140}>
                <p className="mt-s2 max-w-measure text-body text-muted">{profile.statement}</p>
              </Reveal>

              <Reveal delay={200}>
                <div className="mt-s2 flex flex-wrap gap-s2">
                  <Button
                    href="#"
                    variant="primary"
                    data-cta
                    onClick={(e) => {
                      e.preventDefault();
                      openModal();
                    }}
                  >
                    Start a project
                  </Button>
                  <Button href="/Atharva-Ashtekar-CV.pdf" download variant="secondary">
                    Download CV
                  </Button>
                  <Button href="#index" variant="ghost">
                    See the work
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
