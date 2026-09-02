# Portfolio

A single-page personal portfolio. Next.js 15 (App Router), TypeScript, Tailwind.

Static-first and motion-optional: every element ships in its final state, so with
JavaScript disabled or `prefers-reduced-motion: reduce` set, nothing is hidden and
nothing moves. No stock photography, no image payload, no icon library.

```bash
bun install
bun run dev
```

## Editing the content

Everything on the page comes from three files. No component holds a hardcoded
list, so the content can move to a CMS without touching a component.

| File | What it holds |
| --- | --- |
| `src/lib/site.ts` | Name, roles, statement, bio, location, email, socials, the toolkit marquee |
| `src/lib/projects.ts` | The six index plates: order, copy, stack, links |
| `src/lib/capabilities.ts` | The capabilities band and the metrics row |

Each project picks its plate artwork with
`plate: "ledger" | "grid" | "orbit" | "stack" | "mesh" | "wave"`. The artwork is
drawn as SVG in `src/components/ui/Plate.tsx`. Swap in real screenshots there if
you would rather show the products.

## Design tokens

| Token | Value |
| --- | --- |
| Heading font | Syne |
| Body font | Inter |
| Border radius | `0`. Nothing is rounded |
| Colour | Mono paper and ink, one accent (`#ff3b14`) |
| Cards | None. Full-bleed plates with oversized numerals |
| Motion budget | Full, spent on one signature moment |

The tokens are the source of truth and are transcribed into `tailwind.config.ts`
and the `:root` block of `src/app/globals.css`. Change them in both.

## Architecture

Two tiers, and no more:

```
src/
├── app/
│   ├── layout.tsx            <html>, fonts, metadata
│   ├── globals.css           design tokens and motion rules
│   ├── page.tsx              "/" stays thin: chrome and metadata, renders one Main
│   └── components/           LOCAL to "/", relative imports
│       ├── HomeMain.tsx      the page entry component
│       ├── Hero.tsx
│       ├── Marquee.tsx
│       ├── WorkIndex.tsx
│       ├── Capabilities.tsx
│       ├── Approach.tsx
│       └── Contact.tsx
├── components/               GLOBAL, imported through the @/ alias
│   ├── ui/                   Button, Plate, Reveal, SectionHeader
│   └── layout/               AppShell, Navbar, Footer
├── hooks/                    useMotionEnabled, useReveal, useScrollDrift
├── lib/                      site.ts, projects.ts, capabilities.ts, utils.ts
└── types/                    portfolio.ts
```

**Adding a page.** Create `src/app/<route>/page.tsx` plus
`src/app/<route>/components/<Name>Main.tsx`, and keep `page.tsx` thin. Promote a
local component into `src/components/` only once a second page imports it.
Promoting early is how a two-page site ends up with a component library nobody
asked for.

## Motion

Motion is pulled back only under `[data-motion="on"]`, which `useMotionEnabled`
sets on `<html>` after confirming the visitor has not asked for reduced motion.
The default state of every element is its final state.

- `useReveal` runs one document-wide IntersectionObserver that flips
  `data-revealed`. One observer, not one per element.
- `useScrollDrift` sets a rAF-throttled `--drift` variable. This drives the
  signature moment: the index numerals counter-move against the scroll.
- The marquee is CSS-only and stops dead when motion is off.

**A note for future edits.** The clip-path wipe is applied to `[data-wipe] > *`,
never to `[data-wipe]` itself. An element clipped to zero width reports an empty
intersection rect, so a self-clipping target can never trigger the observer that
is meant to un-clip it. That bug looks like "the animation randomly does not
fire" and takes an afternoon to find.

## Verified

- 375, 768 and 1440 wide: no horizontal scroll, no console errors
- `prefers-reduced-motion: reduce`: `data-motion` absent, zero hidden elements,
  marquee animation `none`
- `bunx tsc --noEmit` clean

## Licence

Code is MIT, see [LICENSE](LICENSE). The personal content in `src/lib/` is not
covered by that grant; see [NOTICE](NOTICE). Fork the code, replace the content.
