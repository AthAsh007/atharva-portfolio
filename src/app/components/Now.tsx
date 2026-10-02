import { profile } from "@/lib/site";

/**
 * A compact status band: what is being built right now. A pulsing dot, the
 * project, one line of what it is, and a link to the work. No fake progress
 * number, just the honest state.
 */
export function Now() {
  return (
    <section aria-label="Currently building" className="shell py-s4">
      <div className="liquid-glass flex flex-col gap-s3 rounded-[22px] p-s3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="label text-accent">Currently building</span>
        </div>

        <div className="md:max-w-xl md:text-center">
          <p className="font-heading text-h3">Tenzro</p>
          <p className="mt-1 text-small text-muted">
            Distributed ledger infrastructure and self-custody wallets on Canton.
          </p>
        </div>

        <div className="flex items-center justify-between gap-s3">
          <a href="#index" className="link-underline text-small uppercase tracking-[0.14em]">
            See the work
          </a>
          <span className="hidden text-small uppercase tracking-[0.14em] text-muted lg:inline">
            {profile.location}
          </span>
        </div>
      </div>
    </section>
  );
}
