import { profile } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/** The contact plate — the page inverts to ink and the email is set as display type. */
export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 bg-night text-paper">
      <div className="shell py-s6">
        <Reveal>
          <p className="label border-b border-night-rule pb-s2 text-night-muted">
            <span className="text-accent">04</span> &nbsp;/&nbsp; Contact
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="mt-s4 max-w-[18ch] font-heading text-h1 uppercase tracking-tight">
            Have something that needs building properly
            <span className="text-accent">?</span>
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <a
            href={`mailto:${profile.email}`}
            className="mt-s4 block break-all font-heading text-h2 lowercase tracking-tight underline decoration-night-rule underline-offset-8 transition-colors hover:text-accent hover:decoration-accent"
          >
            {profile.email}
          </a>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-s4 flex flex-wrap items-center gap-s2">
            <Button href={`mailto:${profile.email}`} variant="ghost">
              Send a brief
            </Button>
            {profile.socials
              .filter((social) => social.href.startsWith("http"))
              .map((social) => (
                <Button key={social.href} href={social.href} variant="ghost" target="_blank" rel="noreferrer">
                  {social.label}
                </Button>
              ))}
          </div>
        </Reveal>

        <Reveal delay={260}>
          <p className="mt-s4 border-t border-night-rule pt-s2 text-small uppercase tracking-[0.16em] text-night-muted">
            {profile.location} &nbsp;&mdash;&nbsp; {profile.availability}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
