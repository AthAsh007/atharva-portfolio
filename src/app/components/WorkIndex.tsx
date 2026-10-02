import { projects } from "@/lib/projects";
import { profile } from "@/lib/site";
import { Plate } from "@/components/ui/Plate";
import { Tilt } from "@/components/ui/Tilt";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Selected work as a proper portfolio: one featured case study with the full
 * write-up, then a grid of cover cards. Every card carries a cover, the title,
 * the kicker and year, the role, a stack line and a link, so the work reads as
 * products rather than a list. Covers are the generated plates, framed in glass.
 */
export function WorkIndex() {
  const [featured, ...rest] = projects;
  const n8n = profile.socials.find((s) => s.label.toLowerCase() === "n8n");

  return (
    <section id="index" className="shell scroll-mt-24 py-s5">
      <SectionHeader
        index="01"
        label="Selected work"
        title="Some things I built and shipped."
        description="Ledger infrastructure, multi-tenant AI SaaS, applied research tooling and agentic pipelines. Each one started as an empty repository and runs today."
        action={n8n ? { label: "Workflows published on n8n", href: n8n.href } : undefined}
      />

      {featured ? (
        <Reveal className="mt-s4">
          <article
            id={featured.slug}
            className="liquid-glass group grid scroll-mt-24 gap-s3 rounded-[24px] p-s3 md:grid-cols-2 md:gap-s4 md:p-s4"
          >
            <Cover project={featured} ratio="aspect-[4/3]" />

            <div className="flex flex-col justify-center gap-s2">
              <p className="label">
                <span className="text-accent">{featured.index}</span> &nbsp;/&nbsp; {featured.kicker} &nbsp;/&nbsp; {featured.year}
              </p>
              <h3 className="font-heading text-h1 tracking-tight">{featured.title}</h3>
              <p className="max-w-measure text-body">{featured.summary}</p>
              <p className="max-w-measure text-body text-muted">{featured.detail}</p>

              <dl className="mt-s2 flex flex-wrap gap-x-s3 gap-y-s2 border-t border-rule/40 pt-s2">
                <div>
                  <dt className="label">Role</dt>
                  <dd className="mt-1 font-heading text-h3">{featured.role}</dd>
                </div>
                <div>
                  <dt className="label">Stack</dt>
                  <dd className="mt-1 font-heading text-h3">{featured.stack.join(" / ")}</dd>
                </div>
              </dl>

              {featured.href ? (
                <a
                  href={featured.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline mt-s1 inline-flex items-center gap-2"
                >
                  Read the paper
                </a>
              ) : null}
            </div>
          </article>
        </Reveal>
      ) : null}

      <div className="mt-s3 grid gap-s3 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 3) * 60} className="h-full">
            <article
              id={project.slug}
              className="liquid-glass group flex h-full scroll-mt-24 flex-col gap-s2 rounded-[22px] p-s3 transition-transform duration-300 ease-spring hover:-translate-y-1"
            >
              <Cover project={project} ratio="aspect-[16/10]" />

              <div className="flex items-baseline justify-between gap-s2 pt-s1">
                <h3 className="font-heading text-h3 tracking-tight">{project.title}</h3>
                <span className="shrink-0 font-heading text-h3 text-accent">{project.index}</span>
              </div>

              <p className="label">
                {project.kicker} &nbsp;/&nbsp; {project.year}
              </p>

              <p className="text-body text-muted">{project.summary}</p>

              <ul className="mt-auto flex flex-wrap gap-1.5 pt-s2">
                {project.stack.slice(0, 4).map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-rule/50 px-2.5 py-1 text-small uppercase tracking-[0.1em] text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between border-t border-rule/40 pt-s2">
                <span className="label">{project.role}</span>
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-small uppercase tracking-[0.14em] text-accent transition-opacity hover:opacity-70"
                  >
                    {project.linkLabel ?? "Paper"} &nbsp;&rarr;
                  </a>
                ) : null}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** The generated plate, framed, with the index set as a faint watermark. */
function Cover({
  project,
  ratio,
}: {
  project: (typeof projects)[number];
  ratio: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[18px] ${ratio}`}>
      <Tilt className="block h-full">
        <Plate
          variant={project.plate}
          className="h-full w-full opacity-80 grayscale-[0.55] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:grayscale-0"
        />
      </Tilt>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-1 right-3 font-heading text-[clamp(2.5rem,6vw,4rem)] leading-none text-ink/10"
      >
        {project.index}
      </span>
    </div>
  );
}
