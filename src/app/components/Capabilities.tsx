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
// (lg and up). Tablets get a 2-column grid with the odd fifth tile spanning both.
const spans = [
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "md:col-span-2 lg:col-span-2",
];

export function Capabilities() {
  return (
    <section id="capabilities" className="shell py-s5">
      <SectionHeader
        index="02"
        label="What I do"
        title="What I get hired to do."
        description="Four lanes, one person. Most engagements start in one and end up crossing all four."
      />

      <div className="mt-s4 grid gap-s2 md:grid-cols-2 lg:grid-cols-6">
        {capabilities.map((capability, i) => (
          // The lift lives on the inner pane: on the Reveal itself the reveal
          // rule's `transform: none` (higher specificity) would cancel it.
          <Reveal key={capability.index} delay={i * 70} className={spans[i]}>
            <div
              className={cn(
                "liquid-glass group flex h-full flex-col gap-s3 rounded-glass p-s3",
                "transition-transform duration-300 ease-spring hover:-translate-y-1",
              )}
            >
              <div className="flex items-start justify-between gap-s2">
                <span className="font-heading text-[clamp(3rem,7vw,5.5rem)] leading-none text-accent">
                  {capability.index}
                </span>
                <span className="label pt-2">0{i + 1}</span>
              </div>

              {/* a step below the section h2, so the section title stays the entry point */}
              <h3 className="font-heading text-[clamp(1.375rem,2.4vw,1.75rem)] leading-[1.2] tracking-tight">
                {capability.title}
              </h3>

              {capability.badge ? (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-small text-accent">
                  <span aria-hidden>&#10003;</span>
                  {capability.badge}
                </span>
              ) : null}

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
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
