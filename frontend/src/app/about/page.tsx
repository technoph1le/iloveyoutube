import Link from "next/link";
import { ExternalLink } from "@/components/ui/external-link";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";
import { siteConfig } from "@/data/site";
import { displayedTools } from "@/data/tools";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "iLoveYouTube is a free, open-source collection of YouTube tools for creators and viewers, built to be fast, private and accessible.",
  path: "/about",
});

export default function Page() {
  return (
    <div className="px-4 py-12 sm:py-16">
      <PageHeader
        title="About iLoveYouTube"
        description="Simple, free tools for everyone who makes or watches YouTube."
      />
      <Prose>
        <h2>Why it exists</h2>
        <p>
          Working with YouTube often means juggling a dozen sites full of ads,
          sign-up walls and pop-ups just to grab a thumbnail or check how a
          title looks on a phone. iLoveYouTube puts the tools you actually need
          in one clean place, free for everyone.
        </p>

        <h2>Who it&apos;s for</h2>
        <ul>
          <li>
            <strong>Creators</strong> who want to test thumbnails and titles
            before publishing, and embed their videos on their own websites.
          </li>
          <li>
            <strong>Viewers and fans</strong> who want a video&apos;s thumbnail
            in full resolution, or to share a video on their site the right way.
          </li>
          <li>
            <strong>Developers and designers</strong> who need correct,
            accessible embed code without reading YouTube&apos;s documentation.
          </li>
        </ul>

        <h2>The tools</h2>
        <ul>
          {displayedTools.map((tool) => (
            <li key={tool.slug}>
              <Link href={`/tools/${tool.slug}`}>{tool.title}</Link>:{" "}
              {tool.description}
            </li>
          ))}
        </ul>
        <p>More are on the way, shaped by what the community asks for.</p>

        <h2>What we promise</h2>
        <ul>
          <li>
            <strong>Free, with no account.</strong> Every tool works without
            signing up.
          </li>
          <li>
            <strong>Private.</strong> No ads and no tracking cookies. We count
            visits with cookie-free analytics that can&apos;t identify you.
            Images you test stay on your device. See the{" "}
            <Link href="/privacy">privacy policy</Link>.
          </li>
          <li>
            <strong>Accessible.</strong> The site is built to work with a
            keyboard, screen readers and zoom. Read our{" "}
            <Link href="/accessibility">accessibility statement</Link>.
          </li>
          <li>
            <strong>Open source.</strong> All the code is public, so anyone can
            check how it works or help improve it.
          </li>
        </ul>

        <h2>Who makes it</h2>
        <p>
          iLoveYouTube is built by{" "}
          <ExternalLink href={siteConfig.links.youtube}>
            {siteConfig.author.name}
          </ExternalLink>
          , a developer and YouTube creator. It&apos;s an independent project
          and isn&apos;t affiliated with YouTube or Google.
        </p>

        <h2>Get involved</h2>
        <ul>
          <li>
            Suggest tools and get help in our{" "}
            <ExternalLink href={siteConfig.links.discord}>Discord</ExternalLink>
            .
          </li>
          <li>
            Report bugs or contribute code on{" "}
            <ExternalLink href={siteConfig.links.github}>GitHub</ExternalLink>.
          </li>
          <li>
            Help cover server costs on{" "}
            <ExternalLink href={siteConfig.links.sponsor}>Ko-fi</ExternalLink>.
          </li>
        </ul>
      </Prose>
    </div>
  );
}
