import { Heart } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ExternalLink } from "@/components/ui/external-link";
import { JsonLd } from "@/components/ui/json-ld";
import { ToolCard } from "@/components/ui/tool-card";
import { siteConfig } from "@/data/site";
import { displayedTools } from "@/data/tools";
import { absoluteUrl } from "@/utils/seo";

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description,
              inLanguage: "en",
            },
            {
              "@type": "ItemList",
              name: "YouTube tools",
              itemListElement: displayedTools.map((tool, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: tool.title,
                url: absoluteUrl(`/tools/${tool.slug}`),
              })),
            },
          ],
        }}
      />

      <section className="px-4 pt-10 text-center sm:pt-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Every tool you need to work with{" "}
          <span className="text-brand">YouTube</span> in one place
        </h1>
        <p className="mx-auto mt-4 max-w-4xl text-lg leading-relaxed sm:text-[1.4rem]">
          {siteConfig.description}
        </p>
      </section>

      <section
        aria-labelledby="tools-heading"
        className="mx-auto mt-16 w-full max-w-[1600px] px-4 sm:px-10 xl:px-5"
      >
        <h2 id="tools-heading" className="sr-only">
          Tools
        </h2>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayedTools.map((tool) => (
            <li key={tool.slug} className="flex">
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-muted-foreground">
          More tools are on the way.{" "}
          <ExternalLink
            href={siteConfig.links.discord}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Suggest one on Discord
          </ExternalLink>
          .
        </p>
      </section>

      <section
        aria-labelledby="support-heading"
        className="px-4 py-20 text-center"
      >
        <h2 id="support-heading" className="text-3xl font-bold">
          Help keep it free
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          iLoveYouTube is open source and supported by its users.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <ExternalLink
            href={siteConfig.links.github}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-4 text-[1.05rem] font-medium text-background transition-opacity hover:opacity-90"
          >
            <GithubIcon className="size-5" />
            Contribute on GitHub
          </ExternalLink>
          <ExternalLink
            href={siteConfig.links.sponsor}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-muted px-4 text-[1.05rem] font-medium transition-colors hover:bg-border"
          >
            <Heart className="size-5" aria-hidden />
            Support on Ko-fi
          </ExternalLink>
        </div>
      </section>
    </>
  );
}
