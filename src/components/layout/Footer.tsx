"use client";

import { profile } from "@/lib/site";
import { LocalClock } from "@/components/ui/LocalClock";
import { useCopy, isLink } from "@/hooks/useCopy";
import { cn } from "@/lib/utils";

export function Footer() {
  const { copiedId, copy } = useCopy();

  return (
    <footer className="shell pb-s3 pt-s5">
      <div className="liquid-glass rounded-[22px] px-s3 py-s5">
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

          <ul className="flex flex-col gap-s1 md:items-end">
            {profile.socials.map((social) => {
              const copied = copiedId === social.href;
              return (
                <li key={social.href}>
                  {isLink(social.href) ? (
                    <a
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "me noreferrer" : undefined}
                      className="group inline-flex items-baseline gap-2 text-small text-muted transition-colors hover:text-accent"
                    >
                      <span className="uppercase tracking-[0.16em]">{social.label}</span>
                      <span className="text-rule transition-colors group-hover:text-accent/60">/</span>
                      <span className="text-ink">{social.handle}</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => copy(social.href, social.handle)}
                      className="group inline-flex cursor-pointer items-baseline gap-2 text-small text-muted transition-colors hover:text-accent"
                    >
                      <span className="uppercase tracking-[0.16em]">{social.label}</span>
                      <span className="text-rule transition-colors group-hover:text-accent/60">/</span>
                      <span className={cn("text-ink", copied && "copy-pop text-accent")}>
                        {copied ? "copied" : social.handle}
                      </span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-s4 flex flex-col gap-s2 border-t border-rule/40 pt-s3 text-small uppercase tracking-[0.14em] text-muted md:flex-row md:items-center md:justify-between">
          <p className="inline-flex items-center gap-2">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-accent" />
            All systems operational
          </p>
          <p>
            &copy; {new Date().getFullYear()} {profile.name}
          </p>
          <p className="inline-flex items-center gap-s2">
            <LocalClock />
            <a href="#top" className="transition-colors hover:text-accent">
              Back to top &nbsp;&uarr;
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
