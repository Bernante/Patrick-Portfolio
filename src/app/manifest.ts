import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.name,
    description: site.intro,
    start_url: "/",
    display: "standalone",
    background_color: "#FFF1A6",
    theme_color: "#6B352A",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
