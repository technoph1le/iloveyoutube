import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/utils/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // The API serves tool data, not pages worth indexing.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
