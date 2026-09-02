import { profile } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-night text-paper">
      <div className="shell flex flex-col gap-s3 border-t border-night-rule py-s4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-heading text-h3">
            {profile.name}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-s1 text-small uppercase tracking-[0.16em] text-night-muted">
            {profile.location}
          </p>
        </div>

        <ul className="flex flex-wrap gap-s3">
          {profile.socials.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                className="text-small uppercase tracking-[0.16em] text-night-muted transition-colors hover:text-accent"
              >
                {social.label} &mdash; {social.handle}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="shell border-t border-night-rule py-s2">
        <p className="text-small uppercase tracking-[0.16em] text-night-muted">
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}
