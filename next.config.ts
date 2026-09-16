import type { NextConfig } from "next";

/**
 * Two builds from one project:
 *
 *  - Vercel (the main host): a normal Next.js build, so the contact form's
 *    server route (src/app/api/contact/route.ts) runs there and can read the
 *    private Gmail credentials. No base path.
 *  - GitHub Pages (.github/workflows/deploy.yml): STATIC_EXPORT=true gives
 *    `output: "export"`, plain HTML/CSS/JS in `out/`. Pages cannot run server
 *    code, so the workflow deletes src/app/api first; the form there shows its
 *    "email me instead" message.
 *
 *  - `basePath` comes from NEXT_PUBLIC_BASE_PATH: the Pages workflow sets it to
 *    "/Patrick-Portfolio" (the repo name) because Pages serves the repo from that
 *    sub-folder; locally and on Vercel it is empty. Plain <img> paths add it via
 *    `asset()` in src/lib/site.ts.
 *  - `trailingSlash` emits /about/index.html, which Pages serves at /about/.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: process.env.STATIC_EXPORT === "true" ? "export" : undefined,
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
