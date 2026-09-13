import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return nav.map((item) => ({
    url: item.href === "/" ? site.url : `${site.url}${item.href}`,
    lastModified,
    changeFrequency: "monthly" as const,
    // The home page is the entry point; the rest sit just below it.
    priority: item.href === "/" ? 1 : 0.8,
  }));
}
