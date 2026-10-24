import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

// Metadata for a page: title, description, canonical URL and social previews.
// The Open Graph image comes from the nearest opengraph-image file.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      // Pages with their own opengraph-image file override this (file-based
      // metadata takes priority).
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}

export const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();
