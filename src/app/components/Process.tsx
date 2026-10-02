import { Fragment } from "react";
import { process } from "@/lib/process";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * How a project moves: four glass cards in a row, joined by connector segments
 * that carry an animated pulse. The pulse on each connector is delayed so the
 * signal appears to travel through the pipeline from Understand to Ship. Under
 * reduced motion the connectors are static lines.
 */
export function Process() {
  return (
    <section id="process" className="shell scroll-mt-24 py-s5">
      <SectionHeader
        index="03"
        label="Process"
        title="How a project moves."
        description="Four stages. Automate sits in the middle because that is where most of the time gets saved."
      />

      <div className="mt-s4 flex flex-col gap-s2 md:flex-row md:items-stretch md:gap-0">
        {process.map((step, i) => (
          <Fragment key={step.index}>
            <Reveal
              delay={i * 80}
              className="liquid-glass flex flex-1 flex-col gap-s2 rounded-[22px] p-s3"
            >
              <span className="font-heading text-[clamp(2.5rem,5vw,4rem)] leading-none text-accent">
                {step.index}
              </span>
              <h3 className="font-heading text-h3">{step.title}</h3>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-s2">
                {step.steps.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-rule/50 px-3 py-1 text-small text-muted"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>

            {i < process.length - 1 ? (
              <div
                aria-hidden
                className="hidden shrink-0 items-center justify-center md:flex md:w-14"
              >
                <span className="relative block h-px w-full bg-gradient-to-r from-accent/20 via-accent/50 to-accent/20">
                  <span className="pipeline-pulse" style={{ animationDelay: `${i * 0.55}s` }} />
                </span>
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
