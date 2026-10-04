import type { Metadata, Viewport } from "next";
import { Dancing_Script, Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { profile } from "@/lib/site";
import { jsonLd, siteDescription, siteTitle, siteUrl } from "@/lib/seo";
import "./globals.css";

/* forest-gold type: Fraunces headings, Inter body, JetBrains Mono labels (the
   nav and the hero meta row use it above the fold, so it is preloaded too),
   and the Dancing Script cursive accent. Self-hosted by next/font at build time (works
   with output: "export"), so there is no render-blocking third-party CSS, and
   the size-adjusted fallbacks keep the swap from shifting the layout. All four
   are variable fonts, so each is one file per subset. */
const heading = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-heading",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});
const display = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  fallback: ["cursive"],
});

/* Runs before first paint, so the page never flashes the wrong theme and the
   motion state is decided once (no visible, then hidden, then fading in after
   hydration). Without JS neither attribute is set and the page stays in its
   static final state. If the app has not hydrated after a few seconds, every
   reveal is forced visible (AppShell clears this timer). It also flags Apple
   platforms (data-apple) so the palette hint reads Cmd K or Ctrl K from the
   first paint. */
const prePaint = `try{var d=document.documentElement,t=localStorage.getItem("theme");if(t==="light"||(!t&&matchMedia("(prefers-color-scheme: light)").matches))d.setAttribute("data-theme","light")}catch(e){}try{if(/Mac|iPhone|iPad/.test(navigator.platform))document.documentElement.setAttribute("data-apple","")}catch(e){}try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("data-motion","on");window.__revealSafety=setTimeout(function(){document.documentElement.classList.add("reveal-all")},3000)}}catch(e){}`;

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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "64x64" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // edge to edge on notched phones; fixed chrome pads itself with
  // env(safe-area-inset-*)
  viewportFit: "cover",
  // the on-screen keyboard shrinks the layout viewport (Android Chrome), so
  // dvh-sized dialogs keep their fields and buttons above it
  interactiveWidget: "resizes-content",
  // useTheme points these at the chosen theme once the app hydrates
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1e6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b2a19" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      // the pre-paint script sets data-theme / data-motion before React loads
      suppressHydrationWarning
      className={`${heading.variable} ${body.variable} ${mono.variable} ${display.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaint }} />
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
