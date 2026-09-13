// Static export fix-up for GitHub Pages, run after `next build` (see
// .github/workflows/deploy.yml).
//
// Next 16 writes each page's prefetch data to a nested file, e.g.
//   out/about/__next.about/__PAGE__.txt
// but the browser asks for the flat name
//   out/about/__next.about.__PAGE__.txt
// A Next.js server maps one to the other; a plain static host cannot, so every
// page logged 404s for these background requests (navigation still worked, just
// without the prefetch). This copies each nested file to the flat name.
import { copyFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = process.argv[2] ?? "out";
let copied = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "_next") continue;
    const path = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const file of await readdir(path, { withFileTypes: true })) {
        if (file.isFile()) {
          await copyFile(join(path, file.name), join(dir, `${entry.name}.${file.name}`));
          copied++;
        }
      }
    } else {
      await walk(path);
    }
  }
}

await walk(OUT);
console.log(`flatten-prefetch: copied ${copied} prefetch file(s) in ${OUT}/`);
