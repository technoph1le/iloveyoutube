import { Heart, Share2, Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ExternalLink } from "@/components/ui/external-link";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";
import { siteConfig } from "@/data/site";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Sponsor",
  description:
    "Help keep iLoveYouTube free, ad-free and open source. Support the project on Ko-fi, star it on GitHub or share it with a friend.",
  path: "/sponsor",
});

const ways = [
  {
    icon: Heart,
    title: "Support on Ko-fi",
    text: "A one-off or monthly tip covers servers and the YouTube API, and keeps the site free of ads.",
    href: siteConfig.links.sponsor,
    cta: "Open Ko-fi",
  },
  {
    icon: Star,
    title: "Star on GitHub",
    text: "Stars help other people find the project, and it costs nothing.",
    href: siteConfig.links.github,
    cta: "Open GitHub",
  },
  {
    icon: Share2,
    title: "Tell a creator",
    text: "Know someone who makes videos? Sharing the site with them helps it grow.",
    href: siteConfig.links.discord,
    cta: "Join the Discord",
  },
];

export default function Page() {
  return (
    <div className="px-4 py-12 sm:py-16">
      <PageHeader
        title="Support the project"
        description="iLoveYouTube is free, ad-free and open source. These are the ways you can help keep it that way."
      />
      <ul className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
        {ways.map(({ icon: Icon, title, text, href, cta }) => (
          <li
            key={title}
            className="flex flex-col rounded-2xl border border-border bg-card p-6"
          >
            <Icon className="size-8 text-brand" aria-hidden />
            <h2 className="mt-4 text-xl font-bold">{title}</h2>
            <p className="mt-2 flex-1 text-muted-foreground">{text}</p>
            <ExternalLink
              href={href}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-4 font-medium text-background transition-opacity hover:opacity-90"
            >
              {cta}
            </ExternalLink>
          </li>
        ))}
      </ul>
      <Prose>
        <h2>Where the money goes</h2>
        <ul>
          <li>Hosting for the website and the server behind the tools.</li>
          <li>
            Keeping YouTube data fresh, such as the trending videos in the
            Thumbnail Previewer.
          </li>
          <li>Time to build the next tools the community asks for.</li>
        </ul>
        <p>
          Prefer to give time instead? Contributions of code, design and
          translations are just as welcome on{" "}
          <ExternalLink href={siteConfig.links.github}>
            <GithubIcon className="mr-1 inline size-4 align-[-2px]" />
            GitHub
          </ExternalLink>
          .
        </p>
      </Prose>
    </div>
  );
}
