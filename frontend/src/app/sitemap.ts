import type { MetadataRoute } from "next";
import { displayedTools } from "@/data/tools";
import { absoluteUrl } from "@/utils/seo";

// Only displayed tools are listed; hidden ones stay out of search until built.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    ...displayedTools.map((tool) => ({
      path: `/tools/${tool.slug}`,
      priority: 0.9,
      changeFrequency: "monthly" as const,
    })),
    { path: "/about", priority: 0.5, changeFrequency: "monthly" },
    { path: "/faqs", priority: 0.6, changeFrequency: "monthly" },
    { path: "/sponsor", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/accessibility", priority: 0.2, changeFrequency: "yearly" },
  ];
  return pages.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  }));
}
