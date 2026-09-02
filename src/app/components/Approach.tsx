import { profile } from "@/lib/site";
import { metrics } from "@/lib/capabilities";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** About, told as a position rather than a biography. */
export function Approach() {
  return (
    <section id="approach" className="border-y border-rule bg-[#e9e6df]">
      <div className="shell scroll-mt-24 py-s5">
        <SectionHeader index="03" label="Approach" title="One person, both ends of the stack." />

        <div className="mt-s4 grid gap-s3 md:grid-cols-12 md:gap-s4">
          <div className="md:col-span-7">
            {profile.bio.map((paragraph, i) => (
              <Reveal key={i} delay={i * 90}>
                <p className="mb-s2 max-w-measure text-body">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <div className="md:col-span-5">
            <dl className="grid grid-cols-2 gap-px bg-rule">
              {metrics.map((metric, i) => (
                <Reveal key={metric.label} delay={i * 70} className="bg-[#e9e6df] p-s2">
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="block font-heading text-h1 leading-none">{metric.value}</span>
                    <span className="mt-s1 block text-small uppercase tracking-[0.12em] text-muted">
                      {metric.label}
                    </span>
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
