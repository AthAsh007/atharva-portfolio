"use client";

import { profile } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { useContactModal } from "@/components/ui/ContactModal";
import { useCopy, isLink } from "@/hooks/useCopy";

/**
 * Contact, rebuilt as a split spread. The left half is the pitch: a cursive
 * headline and the email set large. The right half is a liquid-glass action
 * panel with the two ways in (a Calendly slot or the brief modal) and every
 * profile link. No dashed-off mailto button: the CTA opens the modal.
 */
export function Contact() {
  const { openModal } = useContactModal();
  const { copiedId, copy } = useCopy();

  return (
    <section id="contact" className="shell scroll-mt-24 py-s5">
      <div className="grid gap-s4 md:grid-cols-12 md:items-end">
        <div className="md:col-span-6">
          <Reveal>
            <p className="label border-b border-rule/40 pb-s2">
              <span className="text-accent">05</span> &nbsp;/&nbsp; Contact
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-s3 font-display text-[clamp(3rem,9vw,7rem)] leading-[0.88] text-accent">
              Let&apos;s build
              <br />
              <span className="text-ink">something.</span>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <a
              href={`mailto:${profile.email}`}
              className="mt-s4 block break-all font-heading text-h2 tracking-tight underline decoration-accent/40 underline-offset-8 transition-colors hover:text-accent hover:decoration-accent"
            >
              {profile.email}
            </a>
          </Reveal>

          <Reveal delay={170}>
            <div className="mt-s2">
              <CopyEmail email={profile.email} />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-s2 text-small uppercase tracking-[0.16em] text-muted">
              {profile.location}
            </p>
          </Reveal>
        </div>

        <Reveal className="md:col-span-6" delay={120}>
          <div className="liquid-glass rounded-[22px] p-s4">
            <p className="text-body text-muted">
              Two ways in. Book a 30-minute slot, or send a short brief and I reply by email.
            </p>

            <div className="mt-s3 flex flex-wrap gap-s2">
              <Button href={profile.booking} target="_blank" rel="noreferrer" variant="secondary">
                Book a 30-min slot
              </Button>
              <Button
                href="#"
                variant="primary"
                data-cta
                onClick={(e) => {
                  e.preventDefault();
                  openModal();
                }}
              >
                Send a brief
              </Button>
            </div>

            <ul className="mt-s4 grid grid-cols-1 gap-s1 sm:grid-cols-2">
              {profile.socials.map((social) => {
                const copied = copiedId === social.href;
                const rowClass =
                  "group flex w-full items-baseline justify-between gap-s2 rounded-xl border border-rule/40 px-3 py-2 transition-colors hover:border-accent/50";
                const label = (
                  <span className="text-small uppercase tracking-[0.12em] text-muted group-hover:text-accent">
                    {social.label}
                  </span>
                );
                const handle = (
                  <span className={cn("truncate text-small text-ink", copied && "copy-pop text-accent")}>
                    {copied ? "copied" : social.handle}
                  </span>
                );
                return (
                  <li key={social.href}>
                    {isLink(social.href) ? (
                      <a
                        href={social.href}
                        target={social.href.startsWith("http") ? "_blank" : undefined}
                        rel={social.href.startsWith("http") ? "me noreferrer" : undefined}
                        className={rowClass}
                      >
                        {label}
                        {handle}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => copy(social.href, social.handle)}
                        className={cn(rowClass, "cursor-pointer text-left")}
                      >
                        {label}
                        {handle}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            <p className="mt-s4 border-t border-rule/40 pt-s2 text-small uppercase tracking-[0.16em] text-muted">
              {profile.availability} &nbsp;&middot;&nbsp; {profile.location}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
