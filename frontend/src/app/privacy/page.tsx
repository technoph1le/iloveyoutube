import Link from "next/link";
import { ExternalLink } from "@/components/ui/external-link";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";
import { legal } from "@/data/legal";
import { siteConfig } from "@/data/site";
import { formatDate } from "@/utils/format-date";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How iLoveYouTube handles your data: no accounts, no tracking cookies, cookie-free visitor statistics, and images that never leave your device.",
  path: "/privacy",
});

export default function Page() {
  const { operator } = legal;
  return (
    <div className="px-4 py-12 sm:py-16">
      <PageHeader
        title="Privacy Policy"
        description={`Last updated ${formatDate(legal.privacyUpdated)}`}
      />
      <Prose>
        <h2>The short version</h2>
        <ul>
          <li>
            You don&apos;t need an account, and we don&apos;t ask for your name
            or email.
          </li>
          <li>
            No ads, no tracking cookies, and we never sell data.
          </li>
          <li>
            We count visits with Vercel Web Analytics, which uses no cookies and
            can&apos;t tell who you are.
          </li>
          <li>
            Thumbnails you test in the Thumbnail Previewer never leave your
            device.
          </li>
          <li>
            YouTube&apos;s player only loads in the Embed Code Generator after
            you choose to load it, because it connects to Google.
          </li>
        </ul>

        <h2>Who is responsible</h2>
        <p>
          The controller of your data under the EU General Data Protection
          Regulation (GDPR) is {operator.name}, {operator.country}. Contact:{" "}
          {operator.email}.
        </p>

        <h2>What we process, and why</h2>
        <h3>Visiting the website</h3>
        <p>
          When you open a page, your browser sends technical information such as
          your IP address, browser type and the page requested. Our hosting
          provider needs this to deliver the page and protect the service from
          abuse. It may be kept briefly in server logs and then deleted. Legal
          basis: our legitimate interest in running a secure website (GDPR Art.
          6(1)(f)).
        </p>

        <h3>Visitor statistics</h3>
        <p>
          We use{" "}
          <ExternalLink href="https://vercel.com/docs/analytics/privacy-policy">
            Vercel Web Analytics
          </ExternalLink>{" "}
          to see which pages and tools are used, so we know what to improve.
          When you open a page, it records the page address, the referring
          site, your browser, operating system, device type and country. It
          sets no cookies and stores nothing on your device. To count unique
          visitors, it uses a hash of your request that is discarded after 24
          hours, so visits can&apos;t be linked to you or followed across days
          or other websites. We only ever see totals. The script is loaded from
          our own domain. Legal basis: our legitimate interest in understanding
          how the site is used (GDPR Art. 6(1)(f)). You can block it with any
          common content blocker; the site works the same without it.
        </p>

        <h3>Using the tools</h3>
        <ul>
          <li>
            <strong>Thumbnail Previewer:</strong> images, titles and channel
            details you enter are processed only in your browser. They are never
            uploaded, and they disappear when you close the tab.
          </li>
          <li>
            <strong>Thumbnail Downloader and Embed Code Generator:</strong> when
            you paste a link, the video ID is sent to our server, which asks
            YouTube for the video&apos;s public title, channel and thumbnails.
            We keep this public information in a short-term cache (up to 24
            hours) to stay fast. It isn&apos;t linked to you.
          </li>
          <li>
            <strong>Images:</strong> YouTube thumbnails and channel pictures are
            loaded through our own server, so your browser doesn&apos;t contact
            Google just by using the tools.
          </li>
        </ul>

        <h3>YouTube&apos;s player (only if you choose to load it)</h3>
        <p>
          The Embed Code Generator can show a live preview using YouTube&apos;s
          real player. It loads only when you press &ldquo;Load live
          preview&rdquo;. YouTube (Google Ireland Limited for users in the EU)
          then receives your IP address and may store data on your device; with
          privacy-enhanced mode it does so only once you press play. Legal
          basis: your consent (GDPR Art. 6(1)(a)). You can withdraw it at any
          time by reloading the page; the player won&apos;t load again until you
          ask. See{" "}
          <ExternalLink href="https://policies.google.com/privacy">
            Google&apos;s privacy policy
          </ExternalLink>
          .
        </p>

        <h2>Cookies and local storage</h2>
        <p>
          We set one cookie, <code>theme</code>, only when you switch between
          light and dark mode. It stores your choice for one year and contains
          nothing else. Because it only provides a feature you asked for, it
          doesn&apos;t require consent. We use no advertising or tracking
          cookies, and our visitor statistics work without cookies.
        </p>

        <h2>Who else receives data</h2>
        <ul>
          {legal.hostingProviders.map((host) => (
            <li key={host.name}>
              <strong>Hosting:</strong>{" "}
              <ExternalLink href={host.url}>{host.name}</ExternalLink> hosts{" "}
              {host.role} and processes technical data on our behalf. Where
              this happens outside the EU, it&apos;s covered by safeguards the
              GDPR recognizes, such as the EU Standard Contractual Clauses or
              the EU-US Data Privacy Framework.
            </li>
          ))}
          <li>
            <strong>Visitor statistics:</strong> Vercel Inc. processes the
            anonymous page-view data described above on our behalf.
          </li>
          <li>
            <strong>YouTube (Google):</strong> only if you load the live player,
            as described above.
          </li>
          <li>
            <strong>Links to other sites:</strong> GitHub, Discord, Ko-fi and
            YouTube have their own privacy policies, which apply once you follow
            a link to them.
          </li>
        </ul>

        <h2>Your rights</h2>
        <p>Under the GDPR you have the right to:</p>
        <ul>
          <li>
            access the personal data we hold about you, and get a copy of it;
          </li>
          <li>have it corrected or deleted, or its processing restricted;</li>
          <li>object to processing based on our legitimate interests;</li>
          <li>
            withdraw consent at any time, without affecting earlier processing;
          </li>
          <li>
            complain to a data protection authority, such as the one where you
            live.
          </li>
        </ul>
        <p>
          To use any of these rights, contact {operator.email}. Because we
          don&apos;t keep accounts or profiles, we usually hold no personal data
          that can be linked to you.
        </p>

        <h2>Children</h2>
        <p>
          The site isn&apos;t aimed at children under 16 and doesn&apos;t
          knowingly collect their personal data.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes, we&apos;ll update the date at the top of this
          page. Significant changes will also be announced on our{" "}
          <ExternalLink href={siteConfig.links.discord}>Discord</ExternalLink>.
          See also our <Link href="/terms">Terms of Use</Link>.
        </p>
      </Prose>
    </div>
  );
}
