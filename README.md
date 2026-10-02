# Portfolio

A single-page personal portfolio. Next.js 15 (App Router), TypeScript, Tailwind.
Exports to static HTML for Cloudflare Pages.

Static-first and motion-optional: every element ships in its final state, so with
JavaScript disabled or `prefers-reduced-motion: reduce` set, nothing is hidden and
nothing moves. No stock photography, no image payload, no icon library.

```bash
bun install
bun run dev
```

## Design system: Digital Lab x Liquid Glass

Five systems, repeated throughout:

1. **Liquid glass** surfaces: a translucent pane with a blurred backdrop, a
   light-catching border, an inner highlight, a soft shadow and a travelling
   sheen. Used on panels, cards, the nav, the modal and the hero.
2. **Background**: a starfield canvas (twinkling stars, parallax, shooting
   stars) under a dot grid, a grain layer and a cursor glow.
3. **Type**: Fraunces headings, Inter body, JetBrains Mono for labels and the
   technical voice, Dancing Script for the name.
4. **Glow pipelines**: the process section connects its cards with animated
   pulses; plates tilt and glow on hover.
5. **Status indicators**: a live clock, an availability pill, a "currently
   building" dot, and a footer status line.

| Token | Value |
| --- | --- |
| Canvas | Deep forest (`#0b2a19`), ivory text (`#f1ecdd`) |
| Accent | Gold (`#d9ab52`), moss secondary (`#6fae77`) |
| Heading / body / mono | Fraunces / Inter / JetBrains Mono |
| Display (name) | Dancing Script |
| Radius | Liquid glass, up to 28px |
| Motion | Full, spent on a few signature moments |

Tokens live in `:root` and `[data-theme="light"]` in `src/app/globals.css` and are
mirrored into `tailwind.config.ts`. Dark is the default; a light ivory-and-gold
theme is an opt-in toggle that persists in `localStorage`.

## Sections

Hero (liquid-glass masthead) - Now (currently building) - Toolkit (skill
carousel) - Selected work (featured card + cover grid) - Capabilities (bento) -
Process (pipeline) - Approach (principles + numbers) - Contact (split panel) -
Footer.

## Editable content

Everything comes from files under `src/lib/`. No component holds a hardcoded
list.

| File | What it holds |
| --- | --- |
| `site.ts` | Name, roles, statement, bio, location, email, booking link, socials, the grouped toolkit |
| `projects.ts` | The six projects: order, copy, stack, links, plate art |
| `capabilities.ts` | The capabilities bento, the principles, the metrics |
| `process.ts` | The four process stages |

Each project picks its plate art with
`plate: "ledger" | "grid" | "orbit" | "stack" | "mesh" | "wave"`. The art is drawn
as SVG in `src/components/ui/Plate.tsx`.

## Architecture

```
src/
├── app/
│   ├── layout.tsx            <html>, fonts, metadata
│   ├── globals.css           tokens, liquid glass, motion rules
│   ├── page.tsx              thin: renders one Main
│   └── components/           LOCAL to "/"
│       ├── HomeMain.tsx      the page entry component
│       ├── Hero.tsx          liquid-glass masthead
│       ├── Now.tsx           currently-building status band
│       ├── Skills.tsx        skill-group carousel + tech ticker
│       ├── WorkIndex.tsx     featured case study + cover grid
│       ├── Capabilities.tsx  bento grid
│       ├── Process.tsx       four stages + animated pipeline
│       ├── Approach.tsx      principles + metrics strip
│       └── Contact.tsx       split contact panel
├── components/
│   ├── ui/                   Button, Plate, Reveal, Tilt, SectionHeader,
│   │                         ContactModal, CopyEmail, LocalClock
│   └── layout/               AppShell, Navbar, Footer, Cursor, CursorGlow,
│                             Starfield, FloatingCTA, CommandPalette, EasterEgg
├── hooks/                    useMotionEnabled, useReveal, useScrollDrift,
│                             useScrollVelocity, useTheme
├── lib/                      site.ts, projects.ts, capabilities.ts, process.ts,
│                             mouseStore.ts, utils.ts
└── types/                    portfolio.ts
```

## Interactions

- **Command palette**: Cmd/Ctrl+K or "/" (or the nav button) opens a palette that
  jumps to sections, opens the brief, downloads the CV, copies the email,
  switches theme and opens profiles. Arrow keys and Enter navigate it.
- **Custom cursor**: a blend-mode dot with a trailing ring that snaps toward
  interactive elements, on pointer-fine devices.
- **Magnetic buttons**: buttons lean toward the cursor.
- **Copy email**: copies to the clipboard with a small pop.
- **Live clock**: updates every second in IST.
- **Easter egg**: try the Konami code, or open the console.

All of the above are disabled under `prefers-reduced-motion`.

## SEO and GEO

`src/lib/seo.ts` is the single source of truth for the canonical URL, the title
and description, and the structured data, so nothing drifts.

- **Metadata**: canonical link, enriched OpenGraph and Twitter cards, keywords,
  authors, publisher, category, and a `googleBot` directive that allows large
  image previews and unbounded snippets.
- **Structured data**: a schema.org JSON-LD graph rendered in `<head>`: a
  `Person` (with `knowsAbout`, `sameAs`, address), a `WebSite`, a `ProfilePage`,
  and an `ItemList` of the selected work as `CreativeWork` items.
- **Crawling**: `app/sitemap.ts` emits `sitemap.xml`; `app/robots.ts` emits
  `robots.txt` and allows every crawler, AI answer engines included.
- **Answer engines**: `public/llms.txt` is a plain-language fact sheet (roles,
  focus, projects, toolkit, links) written for LLM consumption.
- **Entity verification**: profile links carry `rel="me"`.

## Motion

Motion runs only under `[data-motion="on"]`, which `useMotionEnabled` sets on
`<html>` after confirming the visitor has not asked for reduced motion. The
default state of every element is its final state.

- `useReveal` runs one document-wide IntersectionObserver that flips
  `data-revealed`; section titles reveal word by word.
- `mouseStore` holds a single `mousemove` listener and one rAF loop, driving the
  cursor, cursor glow, hero and background parallax, and every 3D plate tilt.
- `useScrollVelocity` writes `--sv`, which skews the tech ticker with the scroll.
- `Starfield` is a canvas of stars plus occasional shooting stars.

**A note for future edits.** The clip-path wipe is applied to `[data-wipe] > *`,
never to `[data-wipe]` itself. An element clipped to zero width reports an empty
intersection rect, so a self-clipping target can never trigger the observer that
is meant to un-clip it.

## Deploy (Cloudflare Pages)

`next.config.ts` sets `output: "export"`, so `bun run build` writes a static site
to `out/`.

- Build command: `bun install && bun run build`
- Output directory: `out`
- `wrangler.toml` pins the project name and output dir for `wrangler pages deploy out`
- `public/_redirects` serves `index.html` for any path so anchors work
- The CV sits at `public/Atharva-Ashtekar-CV.pdf` and downloads from the hero

## Verified

- `bunx tsc --noEmit` clean
- `bun run build` clean, static export
- `prefers-reduced-motion: reduce`: `data-motion` absent, zero hidden elements

## Licence

Code is MIT, see [LICENSE](LICENSE). The personal content in `src/lib/` is not
covered by that grant; see [NOTICE](NOTICE). Fork the code, replace the content.
