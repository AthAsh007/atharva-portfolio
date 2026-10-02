import { profile, toolkit } from "@/lib/site";
import { projects } from "@/lib/projects";
import { capabilities } from "@/lib/capabilities";

/**
 * Single source of truth for SEO / GEO. Everything with a canonical URL, a
 * description or structured data reads from here, so the page, the sitemap,
 * robots.txt and the JSON-LD graph never drift apart.
 */
export const siteUrl = "https://athash.in";

export const siteTitle = `${profile.name}, AI / ML, Automation and Product Engineer`;

export const siteDescription =
  "Atharva Ashtekar builds AI systems, automation and the products around them: distributed ledger infrastructure, multi-tenant AI SaaS, agent and workflow pipelines, and applied AI research, taken from an empty repository to something running.";

/** Topics for the Person entity; drawn from capabilities and the toolkit. */
const knowsAbout = Array.from(
  new Set([
    ...capabilities.map((c) => c.title),
    ...toolkit.flatMap((g) => g.items),
    "AI systems",
    "LLM agents",
    "Multi-tenant SaaS",
    "Distributed ledgers",
  ]),
);

/**
 * A schema.org graph: the person, the site, the profile page, and the selected
 * work as an ItemList of CreativeWork. Answer engines and search both read this
 * to extract facts without guessing.
 */
export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.name,
      givenName: "Atharva",
      familyName: "Ashtekar",
      jobTitle: "AI / ML, Automation and Product Engineer",
      description: profile.statement,
      url: siteUrl,
      email: `mailto:${profile.email}`,
      telephone: "+919518970722",
      knowsLanguage: ["en", "hi", "mr"],
      knowsAbout,
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
      sameAs: profile.socials.map((s) => s.href).filter((h) => h.startsWith("http")),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: profile.name,
      description: siteDescription,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: siteTitle,
      description: siteDescription,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "ItemList",
      name: "Selected work",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: p.title,
          description: p.summary,
          abstract: p.detail,
          keywords: p.stack.join(", "),
          genre: p.kicker,
          author: { "@id": `${siteUrl}/#person` },
          ...(p.href ? { url: p.href } : {}),
        },
      })),
    },
  ],
};
