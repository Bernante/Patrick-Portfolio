# Patrick Bernante — Portfolio

Personal portfolio for Patrick Bernante — AI Automation Specialist, Web Developer & Video Editor.

## Stack

| Layer      | Choice                        | Why                                                              |
| ---------- | ----------------------------- | ---------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router)       | Static prerendering, Metadata API, built-in sitemap/robots/OG     |
| Language   | TypeScript (strict)           | Catches content/prop mistakes at build time                       |
| Styling    | Tailwind CSS v4               | Design tokens live in `@theme`, utilities generated from them     |
| Icons      | `@phosphor-icons/react` (SSR) | Renders in server components — no client JS cost for icons        |
| Fonts      | Poppins via `next/font`       | Self-hosted, preloaded, zero layout shift                         |
| Animation  | CSS + IntersectionObserver; `motion` for the marquee | Reveals cost no JS library; the marquee uses `motion` |
| UI kit     | shadcn-compatible (`components.json`, `cn`) | Drop-in target for `components/ui` parts |

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Design tokens

Defined once in `src/app/globals.css` under `@theme`:

- **Clay Brown** `#6B352A` — primary, buttons, active nav, dark panels
- **Soft Butter** `#FFF1A6` — page background, text on dark panels
- `--color-ink` `#3A1C16` — headings and body text (13.6:1 on butter)
- `--color-ink-muted` `#5E4036` — secondary text (8.1:1 — still WCAG AAA)

Tailwind generates `bg-blueberry`, `text-ink`, `border-line` etc. from these
automatically, so there is no second place to update a colour. The `blueberry-*`
and `cream-*` token names date from the first palette and were kept so no
component classes had to change: `blueberry` is clay brown, `cream` is butter.

## Accessibility

Built for readers who are visually impaired or elderly:

- **18px base font** (not 16px), with every size in `rem`, so browser zoom and
  OS-level font scaling move the whole layout together.
- All colour pairs meet **WCAG AAA** (7:1+) for body text.
- 3px focus ring with offset on every interactive element; all targets ≥48px.
- `prefers-reduced-motion` fully honoured — the marquee becomes a static wrapped
  list, and every reveal/transition is disabled.
- Skip link, semantic landmarks, exactly one `<h1>` per route, and `aria-current`
  on the nav item matching the current URL.
- Pinch-zoom is never blocked (`maximumScale: 5`).
- **Content is visible without JavaScript** — reveals are progressive enhancement,
  so a blocked or slow script can never blank the page.

## SEO

- Per-route metadata, canonical URL, Open Graph + Twitter cards.
- Generated OG image (`opengraph-image.tsx`) and app icon (`icon.tsx`).
- `sitemap.xml`, `robots.txt`, and a web manifest, all generated at build time.
- JSON-LD `@graph`: `Person`, `WebSite`, `ProfilePage`, `ProfessionalService`
  (with an offer catalogue) and `FAQPage`.
- Every route prerenders to static HTML.

## Routing

The site is **multi-page**, not a one-page scroll. Each nav item is a real route
with its own URL, title, description, canonical and structured data:

| Route | Component | Page-specific schema |
| --- | --- | --- |
| `/` | `sections/Hero` | `ProfilePage` |
| `/projects` | `sections/Projects` | `BreadcrumbList` |
| `/services` | `sections/Services` | `ProfessionalService` + `OfferCatalog` |
| `/about` | `sections/About` | `BreadcrumbList` |
| `/contact` | `sections/Contact` | `FAQPage` |

The shell — skip link, sidebar, `<main>`, footer — lives in `src/app/layout.tsx`,
so the sidebar stays mounted across navigations instead of re-rendering and
re-animating on every click. `Person` and `WebSite` schema are emitted once from
the layout; everything page-specific sits on its own page (an `FAQPage` repeated
across all five routes would claim every page is an FAQ).

Nav links use `next/link` with `usePathname()` for the active state. Adding a
route means: create `src/app/<name>/page.tsx`, add an entry to `nav` and `pages`
in `src/lib/site.ts` — the sidebar and sitemap both read from `nav`, so neither
needs touching.

Each page's `SectionHeading` renders an `<h1>` (pass `as="h2"` if a section is
ever nested inside another page).

## shadcn/ui structure

The project is shadcn-compatible but was **not** initialised with
`npx shadcn@latest init` — that command rewrites `globals.css` with shadcn's
default token set, which would wipe out the Clay Brown/Soft Butter palette and the
accessibility base layer. The same structure was created by hand instead:

- `components.json` — shadcn config (`src/` layout, `@/components/ui` alias)
- `src/lib/utils.ts` — the `cn()` helper every `components/ui` part imports
- `src/components/ui/` — where shadcn components live

shadcn's token names (`--color-background`, `--color-primary`, `--color-border`, …)
are defined in the `@theme` block **mapped onto the brand palette**, so a component
added with `npx shadcn@latest add <name>` inherits this design system instead of
arriving grey. Adding components with the CLI from here on is safe; it only writes
into `src/components/ui/`.

### `components/ui/custom-cursor.tsx`

A pointer-following dot that expands over marked targets. `CustomCursor` wraps
the whole app in `src/app/layout.tsx` (colour set to orange `#ff4c24`), so
`CustomCursorTarget` works on any route. The sidebar's social icons are wired up
as targets.

Two deliberate deviations from the component as shipped:

- **`className="select-text"` on the provider.** The component's base class is
  `relative select-none`; applied site-wide that stops visitors selecting or
  copying any text on the site. `cn()` runs twMerge, so this overrides it.
- **A `isMounted` gate around the cursor overlay.** `useReducedMotion` and the
  pointer media query can only know the truth in the browser, so rendering the
  cursor during SSR and dropping it on the client is a hydration mismatch —
  React discards the whole tree. Nothing renders on the server; the cursor is
  added after mount.

It renders nothing on touch devices (`pointer: coarse`) or when the visitor has
`prefers-reduced-motion` set — both already handled by the component.

To mark a new target, wrap it. Use `size-auto` if the element should keep its own
box rather than the variant's fixed one:

```tsx
<CustomCursorTarget className="size-auto hover:opacity-100">
  <button>…</button>
</CustomCursorTarget>
```

## Tool logos

The marquee uses each tool's real brand mark from `public/logos/`:

| Source | Tools |
| --- | --- |
| `simple-icons` package, regenerate with `node scripts/gen-logos.mjs` | Claude, n8n, Make, Next.js, Figma |
| Vendor's own published icon | VS Code (256px), ChatGPT (180px), GoHighLevel (32px) |
| Adobe letterform tiles (hand-authored SVG) | Premiere Pro, After Effects |

simple-icons deliberately excludes Adobe and Microsoft marks for trademark
reasons and has no GoHighLevel entry, which is why those five come from
elsewhere. **GoHighLevel's is only 32×32** — the largest their site publishes —
so it is slightly soft on high-DPI screens. Drop a bigger
`public/logos/gohighlevel.png` in to replace it; nothing else needs to change.

To add or swap a tool, edit the `tools` array in `src/lib/site.ts` and point
`logo` at a file in `public/logos/`.

### `components/ui/logo-marquee.tsx`

Exports `InfiniteSlider` (the reusable engine), `LogoMarquee` (a bare logo strip)
and the `Logo` type. `src/components/ToolsMarquee.tsx` wraps `InfiniteSlider` with
labelled chips — real logo plus the tool's name — rather than using `LogoMarquee`
directly, so each mark is captioned instead of left to be recognised on sight.

`LogoMarquee` is still available for a plain logo row:

```tsx
import { LogoMarquee } from "@/components/ui/logo-marquee";

<LogoMarquee logos={[{ src: "/logos/claude.svg", alt: "Claude" }]} />;
```

Note its `<img>` styling assumes light logo art on a dark-mode invert
(`dark:brightness-0 dark:invert`); this site is light-only, so that never applies.

## How this was built

`docs/RESUME-SESSION.md` has the Claude Code session id and how to resume or read the build conversation.

`docs/BUILD-LOG.md` records the decisions, the trade-offs, and the six
non-obvious bugs found during the build (invisible content from scroll reveals,
two separate hydration mismatches, a CSS cascade-layer trap, missing `<h1>`s
after the multi-page split, and duplicated JSON-LD). Read it before changing the
reveal logic, the cascade layers, or the routing.

## Editing content

**All copy lives in `src/lib/site.ts`.** Name, tagline, services, projects, tools,
FAQs, contact details and social links are there — components only read from it.

### Before deploying

1. Set `site.url` in `src/lib/site.ts` to the real domain (used for canonical
   URLs, OG tags, sitemap and JSON-LD).
2. Replace the placeholder email, phone and social URLs.
3. Swap the `PB` initials avatar in `src/components/Sidebar.tsx` for a real photo.
4. The contact form opens the visitor's mail client. To collect submissions
   server-side, replace `handleSubmit` in `src/components/ContactForm.tsx` with a
   POST to Formspree, Resend, or a GoHighLevel webhook.
5. Replace the placeholder project results and stats with real numbers.
