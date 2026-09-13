import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";

// Static export (GitHub Pages): generate this file once at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Trailing slashes match the exported pages (trailingSlash in next.config),
  // so crawlers are not sent through a redirect for every URL.
  return nav.map((item) => ({
    url: item.href === "/" ? `${site.url}/` : `${site.url}${item.href}/`,
    lastModified,
    changeFrequency: "monthly" as const,
    // The home page is the entry point; the rest sit just below it.
    priority: item.href === "/" ? 1 : 0.8,
  }));
}
