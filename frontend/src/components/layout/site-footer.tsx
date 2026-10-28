/* eslint-disable @next/next/no-img-element -- a small static SVG badge from
   /public; next/image's optimizer adds nothing. */
import Link from "next/link";
import { DiscordIcon, GithubIcon, RedditIcon, YoutubeIcon } from "@/components/ui/brand-icons";
import { ExternalLink } from "@/components/ui/external-link";
import { siteConfig } from "@/data/site";

const socials = [
  { href: siteConfig.links.github, label: "GitHub", icon: GithubIcon },
  { href: siteConfig.links.discord, label: "Discord", icon: DiscordIcon },
  { href: siteConfig.links.youtube, label: "YouTube channel", icon: YoutubeIcon },
  { href: siteConfig.links.reddit, label: "Reddit community", icon: RedditIcon },
];

// Four columns on laptops and up, as wide as the page content: about and
// community, two link groups, and the Product Hunt badge on the right. On
// phones the about column stacks above the two link groups, which sit side by
// side, with the badge last.
export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 pt-10 pb-6 sm:px-10 xl:px-5">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-[2fr_1fr_1fr_auto]">
        <div className="col-span-2 lg:col-span-1">
          <p className="max-w-sm text-lg leading-relaxed">
            Free, private YouTube tools for creators and viewers. No account, no ads, no tracking cookies.
          </p>

          <ul className="mt-4 -ml-2.5 flex items-center gap-1" aria-label="Community">
            {socials.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <ExternalLink
                  href={href}
                  aria-label={`${label} (opens in a new tab)`}
                  className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-6" />
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>

        {siteConfig.footerNav.map((group) => (
          <nav key={group.title} aria-labelledby={`footer-${group.title}`}>
            <h2 id={`footer-${group.title}`} className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {group.title}
            </h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="col-span-2 lg:col-span-1 lg:justify-self-end">
          <ExternalLink href={siteConfig.links.productHunt} className="inline-block rounded-[10px]">
            <img src="/product-hunt-badge.svg" alt="Find iLoveYouTube on Product Hunt" width={200} height={54} />
          </ExternalLink>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-[1600px] border-t border-border pt-5 text-sm text-muted-foreground">
        © {siteConfig.copyrightYear} {siteConfig.name}. Not affiliated with YouTube or Google.
      </p>
    </footer>
  );
}
