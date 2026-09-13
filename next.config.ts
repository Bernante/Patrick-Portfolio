import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages (see .github/workflows/deploy.yml).
 *
 *  - `output: "export"` writes plain HTML/CSS/JS to `out/`; the site has no
 *    server code (the contact form opens the visitor's email app).
 *  - `basePath` comes from NEXT_PUBLIC_BASE_PATH: the workflow sets it to
 *    "/PatrickBernante-Portfolio" because Pages serves the repo from that
 *    sub-folder; locally it is empty. Plain <img> paths add it via `asset()` in
 *    src/lib/site.ts.
 *  - `trailingSlash` emits /about/index.html, which Pages serves at /about/.
 *  - The old security `headers()` block was removed: static exports cannot set
 *    response headers (GitHub Pages controls those).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
