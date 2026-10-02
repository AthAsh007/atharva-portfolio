import type { Metadata, Viewport } from "next";
import { profile } from "@/lib/site";
import { jsonLd, siteDescription, siteTitle, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${profile.name}`,
  },
  description: siteDescription,
  applicationName: profile.name,
  category: "technology",
  keywords: [
    "Atharva Ashtekar",
    "AI engineer",
    "ML engineer",
    "automation engineer",
    "n8n developer",
    "AI automation portfolio",
    "product engineer",
    "LLM agents",
    "RAG",
    "Next.js",
    "TypeScript",
    "Daml",
    "Canton",
    "distributed ledger",
    "full-stack developer India",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: profile.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0b2a19",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* forest-gold: Fraunces headings, Inter body, JetBrains Mono labels,
            Dancing Script cursive accent. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Dancing+Script:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* structured data: person, site, profile page and selected work */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
