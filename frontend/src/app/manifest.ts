import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "I ♥ YouTube",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f0f",
    theme_color: "#0f0f0f",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }, { src: "/apple-icon", sizes: "180x180", type: "image/png" }],
  };
}
