import type { Metadata } from "next";
import { profile } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${profile.name}'s website and LinkedIn tools handle data.`,
  alternates: { canonical: "/privacy" },
};

const updated = "18 November 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-s5">
      <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.6rem)] leading-tight text-ink">{title}</h2>
      <div className="mt-s2 flex flex-col gap-s2 text-muted">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="shell max-w-3xl py-s5">
      <a href="/" className="text-small uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent">
        &larr; athash.in
      </a>

      <h1 className="mt-s4 font-heading text-[clamp(2rem,5vw,3.25rem)] leading-none text-ink">Privacy policy</h1>
      <p className="mt-s2 text-small uppercase tracking-[0.14em] text-muted">Last updated {updated}</p>

      <Section title="Who runs this">
        <p>
          athash.in and the Athash LinkedIn page are run by {profile.name}, an individual developer based in India.
          For any question about this policy, email{" "}
          <a href={`mailto:${profile.email}`} className="text-accent underline underline-offset-4">
            {profile.email}
          </a>
          .
        </p>
      </Section>

      <Section title="This website">
        <ul className="flex list-disc flex-col gap-s1 pl-5">
          <li>There are no accounts, cookies, analytics or tracking scripts.</li>
          <li>
            The contact form opens your own email app with the message filled in. Nothing is sent to a server. I only
            see what you choose to email me.
          </li>
          <li>Your light or dark theme choice is saved in your browser and never leaves your device.</li>
          <li>
            The site is hosted on Cloudflare, which handles standard request data such as IP address and browser type
            to deliver pages and block attacks. Cloudflare&apos;s own privacy policy covers that.
          </li>
        </ul>
      </Section>

      <Section title="LinkedIn tools">
        <p>
          I build small tools that connect to LinkedIn through its official API. They act only on my own LinkedIn
          account and the Athash page.
        </p>
        <ul className="flex list-disc flex-col gap-s1 pl-5">
          <li>
            <span className="text-ink">What they use:</span> my own posts, comments I write, and the statistics for my
            posts and profile, such as impressions, reactions, comments and follower counts.
          </li>
          <li>
            <span className="text-ink">What they do with it:</span> publish my posts and comments, and save my post
            statistics to a private file so I can see which posts work.
          </li>
          <li>
            <span className="text-ink">What they don&apos;t do:</span> collect data about other LinkedIn members, sell
            any data, or use it for advertising.
          </li>
          <li>
            <span className="text-ink">Storage:</span> the data and the access token stay on my own computer. LinkedIn
            access tokens expire after 60 days.
          </li>
          <li>
            <span className="text-ink">Removing access:</span> the connection can be revoked at any time in LinkedIn
            under Settings, Data privacy, Other applications, Permitted services.
          </li>
        </ul>
      </Section>

      <Section title="Your rights">
        <p>
          You can ask what data I hold about you, or ask me to delete it, by emailing {profile.email}. I reply within
          30 days.
        </p>
      </Section>

      <Section title="Changes">
        <p>If this policy changes, the date at the top changes with it.</p>
      </Section>
    </main>
  );
}
