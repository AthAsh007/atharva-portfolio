import { capabilities } from "@/lib/capabilities";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** The services band — hairline-separated rows, not a grid of shadowed cards. */
export function Capabilities() {
  return (
    <section id="capabilities" className="shell scroll-mt-24 py-s5">
      <SectionHeader
        index="02"
        label="Capabilities"
        title="What I get hired to do."
        description="Four lanes, one person. Most engagements start in one and end up crossing all four, which is usually the point."
      />

      <div className="mt-s4">
        {capabilities.map((capability, i) => (
          <Reveal
            key={capability.index}
            delay={i * 70}
            className="group grid gap-s2 border-t border-rule py-s3 transition-colors hover:bg-ink/[0.03] md:grid-cols-12 md:gap-s3"
          >
            <div className="md:col-span-1">
              <span className="font-heading text-h1 leading-none text-accent">{capability.index}</span>
            </div>

            <h3 className="font-heading text-h2 uppercase tracking-tight md:col-span-4">
              {capability.title}
            </h3>

            <div className="md:col-span-7">
              <p className="max-w-measure text-body text-muted">{capability.body}</p>
              <ul className="mt-s2 flex flex-wrap gap-x-s2 gap-y-1">
                {capability.tags.map((tag, t) => (
                  <li key={tag} className="text-small uppercase tracking-[0.12em] text-muted">
                    {tag}
                    {t < capability.tags.length - 1 ? (
                      <span aria-hidden className="ml-s2 text-rule">
                        &#47;
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
