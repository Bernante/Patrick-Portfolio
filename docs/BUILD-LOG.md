# Build log

A record of how this portfolio was built, what was decided and why, and the bugs
found along the way. Written 2026-09-13.

The full session is archived in `docs/session/` (see the end of this file).

---

## Where the project lives, and why

**`C:\Users\HUAWEI\dev\port-v3`** — not `C:\Users\HUAWEI\Pictures\port v3`.

Windows Defender's **Controlled Folder Access** is enabled on this machine
(`EnableControlledFolderAccess = 1`). It blocks all file creation in `Pictures\`
and `Documents\`, which is where the project was originally going to live. Every
write failed with a misleading `ENOENT` rather than a permissions error.

`Downloads\` and `dev\` are writable. If you ever want the project back under
`Pictures`, you would need to allow the app through Controlled Folder Access in
Windows Security → Virus & threat protection → Ransomware protection.

## Stack, and why each piece

| Layer | Choice | Reason |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | Static prerendering, Metadata API, built-in sitemap/robots/OG |
| Language | TypeScript (strict) | Catches content/prop mistakes at build time |
| Styling | Tailwind CSS v4 | Design tokens in `@theme`; utilities generated from them |
| Icons | `@phosphor-icons/react` (SSR entry) | Renders in server components — no client JS for icons |
| Fonts | Poppins via `next/font` | Self-hosted, preloaded, no layout shift |
| Reveals | CSS + IntersectionObserver | No animation library needed for scroll reveals |
| Marquee / cursor | `motion` | Needed by the two `components/ui` parts |

Next.js was pinned to 15.5.2 at first; npm flagged a security advisory
(CVE-2025-66478) on install, so it was upgraded to 16.x immediately and React
aligned to 19.2+.

## Design

- **Blueberry `#243B8F`** and **Cream Sode `#FFF0C9`**, taken from the supplied
  colour reference.
- Contrast was calculated rather than eyeballed: `--color-ink` `#16204F` is
  12.3:1 on cream and `--color-ink-muted` `#3A477C` is 7.8:1 — both clear WCAG
  **AAA** for body text.
- Base font is **18px**, not the 16px default, per the brief to optimise for
  visually impaired and elderly readers. Every size is in `rem` so browser and
  OS zoom scale the whole layout together.

A sidebar text-size control (18/20/22/24px, persisted in `localStorage`) was
built and later **removed at the user's request**. All of its supporting code
was removed with it — the component, the `localStorage` restore in the pre-paint
script, and the now-unused `TextAa` icon registry entry.

---

## Bugs found and fixed

These are the non-obvious ones worth remembering.

### 1. The entire main column rendered invisible

Framer Motion's `whileInView` held every section at `opacity: 0` until an
IntersectionObserver fired. Any visitor with slow or blocked JS got a blank page
— the content was in the HTML but invisible.

**Fix:** rebuilt reveals as progressive enhancement. Content is visible by
default; only once JS confirms it is alive (an inline script adds `.js` to
`<html>`) does CSS hide it ready to animate, with a 1.5s timeout safety net.
Framer Motion was dropped entirely at that point.

### 2. Headings rendered dark-on-navy

`h1–h4 { color: … }` was written as **unlayered** CSS. Unlayered rules beat
*every* layered rule regardless of specificity, so it overrode Tailwind's
`text-cream` utility on the navy panels.

**Fix:** moved base element styles into `@layer base`, and component classes
into `@layer components`.

**This trap recurred later** — see the scrollbar utility below.

### 3. Hydration mismatch from the pre-paint script

The inline script adds `.js` to `<html>` before React hydrates, so server and
client markup differ there by design.

**Fix:** `suppressHydrationWarning` scoped to that one element.

### 4. Hydration mismatch from `useReducedMotion`

`useReducedMotion()` returns `false` during SSR and `true` in the browser when
the visitor has reduced motion set. Branching on it directly made the server and
client render different trees — React discarded and rebuilt the whole page.

**Fix:** a `mounted` gate. The server always renders the static branch; the
animated branch is swapped in after mount. The same gate was applied
pre-emptively to `custom-cursor.tsx`, which has the identical shape.

### 5. Missing `<h1>` on four of five pages

After splitting into routes, only the home page had an `<h1>` — the section
components used `<h2>` because they had been written to sit under the Hero's
`h1` on a single page. That throws away the strongest on-page ranking signal.

**Fix:** `SectionHeading` renders `<h1>` by default (with an `as="h2"` escape
hatch), and the headings beneath it were stepped down so no level is skipped.

### 6. JSON-LD would have duplicated across every route

`JsonLd` moved into the layout during the multi-page conversion, which would
have emitted `FAQPage` and `ProfilePage` on all five routes — claiming every
page is an FAQ.

**Fix:** split into site-wide schema (`Person`, `WebSite`) in the layout, and
page-specific schema on the page it describes, plus `BreadcrumbList` on inner
pages.

---

## Decisions worth knowing

### Multi-page, not one-page scroll

Originally a single page with anchor navigation and scroll-spy. Converted to
real routes so each section has its own URL, title, description, canonical and
structured data. The trade-off: no single page contains everything any more, so
sending a prospect the whole story is five clicks rather than one scroll.

### shadcn structure created by hand

`npx shadcn@latest init` was **not** run. It rewrites `globals.css` with
shadcn's default token set, which would have wiped out the Blueberry/Cream
palette and the accessibility base layer. The same structure was created
manually — `components.json`, `src/lib/utils.ts`, `src/components/ui/` — and
shadcn's token names were mapped onto the brand palette so future
`npx shadcn add` components arrive on-brand instead of grey.

### Tool logos: real marks, not guessed paths

`simple-icons` carries only 5 of the 10 tools — it excludes Adobe and Microsoft
marks for trademark reasons and has no GoHighLevel entry. Rather than
hand-drawing SVG paths from memory (which produces marks that look *almost*
right), the rest were fetched from the vendors themselves. Adobe's Pr/Ae are
hand-authored, but that is accurate: their product icons genuinely are a rounded
square with letterforms.

**GoHighLevel's logo is only 32×32** — the largest their site publishes. Their
own homepage's high-res images are all client logos. Drop a better file into
`public/logos/gohighlevel.png` to replace it.

### Component integrations deviate from upstream where needed

Both `components/ui` parts were copied verbatim, then adjusted at the usage site
or with a documented edit:

- **`logo-marquee.tsx`** — `durationOnHover` is set *slower* than the base speed
  (the upstream demo speeds up on hover, which is backwards when someone hovers
  to read). The moving strip is `aria-hidden` with a single `sr-only` list
  beside it, because `InfiniteSlider` renders its children twice.
- **`custom-cursor.tsx`** — the provider gets `className="select-text"`. The
  component's base class is `relative select-none`, which applied site-wide
  would stop visitors selecting or copying any text at all.

### Reduced motion is honoured everywhere

The marquee becomes a static wrapped list, reveals are disabled, and the custom
cursor renders nothing. **This machine has Windows animation effects turned
off** (`MinAnimate = 0`), so Chrome reports `prefers-reduced-motion: reduce` and
these effects will not appear locally. Turn them on at Settings → Accessibility
→ Visual effects → Animation effects to see them.

---

## Still to do before deploying

1. Set `site.url` in `src/lib/site.ts` to the real domain — it feeds canonical
   URLs, OG tags, the sitemap and JSON-LD.
2. Replace the placeholder email, phone and social URLs.
3. Swap the `PB` initials avatar for a real photo.
4. **Replace the placeholder stats and project results** — the numbers in
   `site.ts` (60+ automations, PageSpeed 54→98, etc.) are plausible
   illustrations, not real figures.
5. Point the contact form at a real endpoint. It currently opens the visitor's
   mail client; `handleSubmit` in `ContactForm.tsx` is the swap point.

---

## Session archive

| File | What it is |
| --- | --- |
| `docs/session/transcript.jsonl` | Raw Claude Code session log (~13 MB, includes screenshots as base64) |
| `docs/session/transcript.md` | Readable Markdown export (~260 KB) |

Regenerate the Markdown from the raw log with:

```bash
node scripts/export-transcript.mjs docs/session/transcript.jsonl docs/session/transcript.md
```

`docs/session/` is gitignored — the raw log is large and contains full file
contents and screenshots. Remove the ignore rule if you want it committed.
