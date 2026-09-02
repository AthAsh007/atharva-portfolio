import { profile } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The studio hero: the name set as large as the viewport allows, an index rule,
 * and nothing centred. No card, no gradient, no illustration — the type is the
 * image.
 */
export function Hero() {
  return (
    <section className="shell pb-s5 pt-s6">
      <div className="flex flex-wrap items-baseline justify-between gap-s2 border-b border-rule pb-s2">
        <Reveal>
          <p className="label">
            <span className="text-accent">00</span> &nbsp;/&nbsp; Portfolio &mdash; {new Date().getFullYear()}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <p className="label flex items-center gap-2">
            <span aria-hidden className="inline-block h-2 w-2 bg-accent" />
            {profile.availability}
          </p>
        </Reveal>
      </div>

      <h1 className="mt-s4 font-heading text-display uppercase">
        <Reveal as="span" className="block">
          Atharva
        </Reveal>
        <Reveal as="span" className="block" delay={120}>
          Ashtekar
          <span className="text-accent">.</span>
        </Reveal>
      </h1>

      <div className="mt-s4 grid gap-s3 border-t border-rule pt-s3 md:grid-cols-12">
        <Reveal className="md:col-span-5" delay={80}>
          <ul className="flex flex-col gap-1">
            {profile.roles.map((role) => (
              <li key={role} className="font-heading text-h3 uppercase tracking-tight">
                {role}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="md:col-span-7" delay={160}>
          <p className="max-w-measure text-body text-muted">{profile.statement}</p>
          <div className="mt-s3 flex flex-wrap gap-s2">
            <Button href="#index">See the index</Button>
            <Button href="#contact" variant="secondary">
              Start a project
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
