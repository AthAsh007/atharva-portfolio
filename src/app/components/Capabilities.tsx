import { cn } from "@/lib/utils";
import { capabilities } from "@/lib/capabilities";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Capabilities as an asymmetric bento rather than a stack of full-width rows.
 * Four liquid-glass tiles of different spans (3/3, 2/4) break the column rhythm;
 * each carries its letter, title, body and tags. The metrics sit in a glass
 * strip beneath.
 */

// tile spans on a 6-column grid: two half-width, then three thirds
const spans = ["md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-2", "md:col-span-2"];

export function Capabilities() {
  return (
    <section id="capabilities" className="shell scroll-mt-24 py-s5">
      <SectionHeader
        index="02"
        label="What I do"
        title="What I get hired to do."
        description="Four lanes, one person. Most engagements start in one and end up crossing all four."
      />

      <div className="mt-s4 grid gap-s2 md:grid-cols-6">
        {capabilities.map((capability, i) => (
          <Reveal
            key={capability.index}
            delay={i * 70}
            className={cn(
              "liquid-glass group flex flex-col gap-s3 rounded-[22px] p-s3",
              "transition-transform duration-300 ease-spring hover:-translate-y-1",
              spans[i],
            )}
          >
            <div className="flex items-start justify-between gap-s2">
              <span className="font-heading text-[clamp(3rem,7vw,5.5rem)] leading-none text-accent">
                {capability.index}
              </span>
              <span className="label pt-2">0{i + 1}</span>
            </div>

            <h3 className="font-heading text-h2 tracking-tight">{capability.title}</h3>
            <p className="max-w-measure text-body text-muted">{capability.body}</p>

            <ul className="mt-auto flex flex-wrap gap-x-s2 gap-y-1 pt-s2">
              {capability.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-rule/50 px-3 py-1 text-small uppercase tracking-[0.1em] text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
