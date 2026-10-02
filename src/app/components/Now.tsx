import { currently } from "@/lib/site";

/**
 * A compact status band: what is being built right now. A pulsing dot, then a
 * list of the active work. No fake progress numbers, just the honest state.
 */
export function Now() {
  return (
    <section aria-label="Currently building" className="shell py-s4">
      <div className="liquid-glass rounded-[22px] p-s3">
        <div className="flex flex-wrap items-center justify-between gap-s2">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="label text-accent">Currently building</span>
          </div>
          <a href="#index" className="link-underline text-small uppercase tracking-[0.14em]">
            See the work
          </a>
        </div>

        <ul className="mt-s3 grid gap-s3 border-t border-rule/40 pt-s3 md:grid-cols-2">
          {currently.map((item) => (
            <li key={item.title} className="flex flex-col gap-1">
              <span className="font-heading text-h3">{item.title}</span>
              <span className="max-w-measure text-small text-muted">{item.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
