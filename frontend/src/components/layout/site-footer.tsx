import Link from "next/link";
import { DiscordIcon, GithubIcon, YoutubeIcon } from "@/components/ui/brand-icons";
import { ExternalLink } from "@/components/ui/external-link";
import { siteConfig } from "@/data/site";

const socials = [
  { href: siteConfig.links.github, label: "GitHub", icon: GithubIcon },
  { href: siteConfig.links.discord, label: "Discord", icon: DiscordIcon },
  { href: siteConfig.links.youtube, label: "YouTube channel", icon: YoutubeIcon },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-12 text-center">
      <p className="mx-auto max-w-2xl text-lg leading-relaxed">
        Free, private YouTube tools for creators and viewers. No account, no ads, no tracking cookies.
      </p>

      <nav aria-label="Footer" className="mt-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted-foreground">
          {siteConfig.footerNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ul className="mt-8 flex items-center justify-center gap-4" aria-label="Community">
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

      <p className="mx-auto mt-8 max-w-2xl text-sm text-muted-foreground">
        © {siteConfig.copyrightYear} {siteConfig.name}. Not affiliated with YouTube or Google. YouTube is a
        trademark of Google LLC.
      </p>
    </footer>
  );
}
