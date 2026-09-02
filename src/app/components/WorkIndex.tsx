import { projects } from "@/lib/projects";
import { Plate } from "@/components/ui/Plate";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * The index — the spine of the page.
 *
 * No uniform cards: every entry is a full-bleed plate with an oversized numeral
 * that counter-drifts against the scroll (the page's one signature moment).
 * Plates alternate sides so the eye zig-zags down the grid instead of scanning
 * a column of identical tiles.
 */
export function WorkIndex() {
  return (
    <section id="index" className="shell scroll-mt-24 py-s5">
      <SectionHeader
        index="01"
        label="Selected work"
        title="Six things I built end to end."
        description="Ledger infrastructure, multi-tenant SaaS, applied AI research tooling and agentic pipelines. Each one taken from an empty repository to something running."
      />

      <ol className="mt-s5 flex flex-col gap-s6">
        {projects.map((project, i) => {
          const flipped = i % 2 === 1;
          return (
            <li key={project.slug} id={project.slug} className="scroll-mt-24">
              <article className="grid items-center gap-s3 md:grid-cols-12 md:gap-s4">
                <div className={flipped ? "md:col-span-7 md:order-2" : "md:col-span-7"}>
                  <Plate variant={project.plate} className="aspect-[14/11]" />
                </div>

                <div className={flipped ? "md:col-span-5 md:order-1" : "md:col-span-5"}>
                  <div
                    data-drift=""
                    style={{ "--drift-range": "2.5rem" } as React.CSSProperties}
                    className="font-heading text-index leading-none text-accent"
                  >
                    {project.index}
                  </div>

                  <Reveal>
                    <p className="label mt-s2">
                      {project.kicker} &nbsp;/&nbsp; {project.year}
                    </p>
                    <h3 className="mt-s1 font-heading text-h1 uppercase tracking-tight">{project.title}</h3>
                  </Reveal>

                  <Reveal delay={80}>
                    <p className="mt-s2 max-w-measure text-body">{project.summary}</p>
                    <p className="mt-s2 max-w-measure text-body text-muted">{project.detail}</p>
                  </Reveal>

                  <Reveal delay={140}>
                    <dl className="mt-s3 border-t border-rule pt-s2">
                      <dt className="label">Role</dt>
                      <dd className="mt-1 font-heading text-h3">{project.role}</dd>
                    </dl>

                    <ul className="mt-s2 flex flex-wrap gap-x-s2 gap-y-1">
                      {project.stack.map((tech) => (
                        <li key={tech} className="border border-rule px-2 py-1 text-small uppercase tracking-[0.12em] text-muted">
                          {tech}
                        </li>
                      ))}
                    </ul>

                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group mt-s2 inline-flex items-center gap-2 border-b border-ink pb-1 text-small uppercase tracking-[0.16em] transition-colors hover:border-accent hover:text-accent"
                      >
                        Read more
                        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                          &rarr;
                        </span>
                      </a>
                    ) : null}
                  </Reveal>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
