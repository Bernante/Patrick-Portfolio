import type { MetadataRoute } from "next";
import { asset, basePath, site } from "@/lib/site";

// Static export (GitHub Pages): generate this file once at build time.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.name,
    description: site.intro,
    // Include the GitHub Pages sub-folder, or the installed app opens the
    // bare bernante.github.io root instead of this site.
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#FFF1A6",
    theme_color: "#6B352A",
    icons: [{ src: asset("/icon.png"), sizes: "512x512", type: "image/png" }],
  };
}
