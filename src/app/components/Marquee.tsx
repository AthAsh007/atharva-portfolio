import { toolkit } from "@/lib/site";

/**
 * The toolkit band, running as a marquee rather than a skills grid — a studio
 * index shows its client strip here, so this shows what the work is built from.
 * Duplicated once and translated -50% for a seamless loop; CSS-only, so it needs
 * no JS and stops dead under prefers-reduced-motion.
 */
export function Marquee() {
  return (
    <section aria-label="Toolkit" className="overflow-hidden border-y border-rule bg-ink py-s2 text-paper">
      <div className="marquee-track flex w-max items-center whitespace-nowrap">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex items-center">
            {toolkit.map((item) => (
              <li key={item} className="mr-s3 flex items-center gap-s3 font-heading text-h3 uppercase tracking-tight">
                {item}
                <span aria-hidden className="text-accent">
                  &#47;&#47;
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
