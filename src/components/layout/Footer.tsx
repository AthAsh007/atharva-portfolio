"use client";

import { profile, sideProjects } from "@/lib/site";
import { LocalClock } from "@/components/ui/LocalClock";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { useCopy, isLink } from "@/hooks/useCopy";
import { cn } from "@/lib/utils";

export function Footer() {
  const { copiedId, copy } = useCopy();

  return (
    <footer className="shell pb-s3 pt-s5">
      <div className="liquid-glass rounded-glass px-s2 py-s5 sm:px-s3">
        <p className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-none text-accent">
          End of transmission.
        </p>

        <div className="mt-s5 flex flex-col gap-s4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-none text-ink">
              {profile.shortName}
              <span className="text-accent">.</span>
            </p>
            <p className="mt-s2 text-small uppercase tracking-[0.16em] text-muted">
              {profile.location} &nbsp;&middot;&nbsp; {profile.availability}
            </p>
          </div>

          <ul className="flex flex-col md:items-end">
            {profile.socials.map((social) => {
              const copied = copiedId === social.href;
              return (
                <li key={social.href}>
                  {isLink(social.href) ? (
                    <a
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "me noreferrer" : undefined}
                      className="group inline-flex max-w-full flex-wrap items-baseline gap-x-2 py-1 text-small [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:items-center text-muted transition-colors hover:text-accent"
                    >
                      <span className="uppercase tracking-[0.16em]">{social.label}</span>
                      <span className="text-rule transition-colors group-hover:text-accent/60">/</span>
                      <span className="min-w-0 text-ink [overflow-wrap:anywhere]">{social.handle}</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => copy(social.href, social.handle)}
                      className="group inline-flex max-w-full cursor-pointer flex-wrap items-baseline gap-x-2 py-1 text-small [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:items-center text-muted transition-colors hover:text-accent"
                    >
                      <span className="uppercase tracking-[0.16em]">{social.label}</span>
                      <span className="text-rule transition-colors group-hover:text-accent/60">/</span>
                      <span className={cn("min-w-0 text-ink [overflow-wrap:anywhere]", copied && "copy-pop text-accent")}>
                        {copied ? "copied" : social.handle}
                      </span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {sideProjects.length > 0 ? (
          <div className="mt-s4 border-t border-rule/40 pt-s3">
            <p className="label">Side projects</p>
            <ul className="mt-s2 grid gap-s2 sm:grid-cols-2 lg:grid-cols-3">
              {sideProjects.map((p) => (
                <li key={p.href}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col gap-1 py-1 [@media(pointer:coarse)]:min-h-11"
                  >
                    <span className="text-small uppercase tracking-[0.16em] text-ink transition-colors group-hover:text-accent">
                      {p.title} &nbsp;&rarr;
                    </span>
                    <span className="text-small text-muted">{p.note}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-s4 flex flex-col gap-s2 border-t border-rule/40 pt-s3 text-small uppercase tracking-[0.14em] text-muted md:flex-row md:items-center md:justify-between">
          <p className="inline-flex items-center gap-2">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-accent" />
            All systems operational
          </p>
          <p>
            &copy; <CurrentYear /> {profile.name}
          </p>
          <p className="inline-flex items-center gap-s2">
            <LocalClock />
            <a href="#top" className="inline-flex min-h-11 items-center transition-colors hover:text-accent">
              Back to top &nbsp;&uarr;
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
