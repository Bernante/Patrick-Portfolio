/**
 * Sub-folder the site is served from. GitHub Pages serves this repo at
 * https://bernante.github.io/-PatrickBernante-Portfolio/, so the deploy
 * workflow (.github/workflows/deploy.yml) builds with
 * NEXT_PUBLIC_BASE_PATH=/-PatrickBernante-Portfolio; locally it is empty.
 *
 * Kept in its own file on purpose: site.ts exports a `process` list (the work
 * steps), which hides Node's `process` there. Next.js inlines the literal
 * `process.env.NEXT_PUBLIC_BASE_PATH` into browser code, so it must be read
 * somewhere `process` is not shadowed.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
