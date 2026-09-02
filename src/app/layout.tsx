import type { Metadata, Viewport } from "next";
import { profile } from "@/lib/site";
import "./globals.css";

const description =
  "Atharva Ashtekar builds AI systems and the products around them: distributed ledger infrastructure, multi-tenant AI SaaS, agentic tooling and applied AI research, taken from an empty repository to something running.";

export const metadata: Metadata = {
  metadataBase: new URL("https://atharvaashtekar.com"),
  title: {
    default: `${profile.name}, AI / ML and Product Engineer`,
    template: `%s | ${profile.name}`,
  },
  description,
  keywords: [
    "Atharva Ashtekar",
    "AI engineer",
    "ML engineer",
    "product engineer",
    "Next.js",
    "Daml",
    "Canton",
    "LLM agents",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    title: `${profile.name}, AI / ML and Product Engineer`,
    description,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name}, AI / ML and Product Engineer`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* studio-folio: Syne headings, Inter body. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
