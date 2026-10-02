import { profile } from "@/lib/site";
import { metrics, principles } from "@/lib/capabilities";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Approach, rebuilt as positions rather than a paragraph wall. A single lead
 * statement sets the stance, three numbered principles spell out how the work
 * gets done, and the numbers sit in a glass strip beneath. Scannable, and it
 * reads as a point of view instead of a biography.
 */
export function Approach() {
  return (
    <section id="approach" className="shell scroll-mt-24 py-s5">
      <SectionHeader index="04" label="About" title="One person, both ends of the stack." />

      <Reveal className="mt-s4">
        <p className="max-w-[54ch] font-heading text-h2 leading-[1.3] text-ink">
          {profile.bio[0]}
        </p>
      </Reveal>

      <div className="mt-s4 grid gap-s2 md:grid-cols-3">
        {principles.map((principle, i) => (
          <Reveal
            key={principle.index}
            delay={i * 70}
            className="liquid-glass flex flex-col gap-s2 rounded-[22px] p-s3"
          >
            <span className="font-heading text-[clamp(2.5rem,5vw,4rem)] leading-none text-accent">
              {principle.index}
            </span>
            <h3 className="font-heading text-h3">{principle.title}</h3>
            <p className="text-body text-muted">{principle.body}</p>
          </Reveal>
        ))}
      </div>

      <dl className="liquid-glass mt-s2 grid grid-cols-2 gap-y-s3 rounded-[22px] p-s4 sm:grid-cols-4">
        {metrics.map((metric, i) => (
          <Reveal key={metric.label} delay={i * 70} className="px-s2">
            <dt className="sr-only">{metric.label}</dt>
            <dd>
              <span className="block font-heading text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.1] text-accent">
                {metric.value}
              </span>
              <span className="mt-s1 block text-small uppercase tracking-[0.12em] text-muted">
                {metric.label}
              </span>
            </dd>
          </Reveal>
        ))}
      </dl>

      <Reveal delay={200}>
        <p className="mt-s3 label">
          Currently &nbsp;/&nbsp; Manexus &nbsp;&middot;&nbsp; Tenzro
        </p>
      </Reveal>
    </section>
  );
}
