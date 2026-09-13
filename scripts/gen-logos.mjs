/**
 * Generates the brand logo SVGs in public/logos/ from the `simple-icons`
 * package, so the marquee uses each tool's real mark in its official colour.
 *
 *   node scripts/gen-logos.mjs
 *
 * Only the tools simple-icons actually carries are generated here. Adobe and
 * Microsoft marks are absent from that package for trademark reasons, and
 * GoHighLevel is not in it at all — those logo files are committed directly in
 * public/logos/ instead. See README.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as si from "simple-icons";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "logos");
mkdirSync(OUT, { recursive: true });

const all = Object.values(si).filter((i) => i && i.title);
const byTitle = (t) => all.find((i) => i.title.toLowerCase() === t.toLowerCase());

/** [output file name, simple-icons title] */
const WANT = [
  ["claude", "Claude"],
  ["n8n", "n8n"],
  ["make", "Make"],
  ["nextjs", "Next.js"],
  ["figma", "Figma"],
];

for (const [name, title] of WANT) {
  const icon = byTitle(title);
  if (!icon) {
    console.warn("MISSING from simple-icons:", title);
    continue;
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${icon.title}">` +
    `<title>${icon.title}</title>` +
    `<path fill="#${icon.hex}" d="${icon.path}"/>` +
    `</svg>`;
  writeFileSync(join(OUT, `${name}.svg`), svg, "utf8");
  console.log("wrote", `${name}.svg`, `#${icon.hex}`);
}
