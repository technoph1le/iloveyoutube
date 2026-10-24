import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/ui/json-ld";
import { siteConfig } from "@/data/site";
import type { Tool } from "@/data/tools";
import { absoluteUrl, pageMetadata } from "@/utils/seo";

export function toolMetadata(tool: Tool): Metadata {
  return pageMetadata({
    title: tool.metaTitle ?? tool.title,
    description: tool.metaDescription ?? tool.description,
    path: `/tools/${tool.slug}`,
  });
}

// Shared frame for every tool: breadcrumb, heading and structured data
// describing the tool as a free web app.
export function ToolPage({ tool, children }: { tool: Tool; children: ReactNode }) {
  const url = absoluteUrl(`/tools/${tool.slug}`);
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-10 sm:py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: tool.title,
              description: tool.metaDescription ?? tool.description,
              url,
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              browserRequirements: "Requires JavaScript",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: tool.title, item: url },
              ],
            },
          ],
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex items-center justify-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-foreground">
              All tools
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page" className="text-foreground">
            {tool.title}
          </li>
        </ol>
      </nav>
      <header className="text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">{tool.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{tool.description}</p>
      </header>
      <div className="mt-10">{children}</div>
    </div>
  );
}
