import { ExternalLink } from "@/components/ui/external-link";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";
import { legal } from "@/data/legal";
import { siteConfig } from "@/data/site";
import { formatDate } from "@/utils/format-date";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Accessibility Statement",
  description:
    "iLoveYouTube aims to meet WCAG 2.2 level AA. Learn what we do to make the tools accessible, known limitations, and how to report a problem.",
  path: "/accessibility",
});

export default function Page() {
  return (
    <div className="px-4 py-12 sm:py-16">
      <PageHeader
        title="Accessibility Statement"
        description={`Last reviewed ${formatDate(legal.accessibilityUpdated)}`}
      />
      <Prose>
        <h2>Our commitment</h2>
        <p>
          {siteConfig.name} should work for everyone, including people who use a
          keyboard, a screen reader, magnification or other assistive
          technology. We aim to meet the{" "}
          <ExternalLink href="https://www.w3.org/TR/WCAG22/">
            Web Content Accessibility Guidelines (WCAG) 2.2
          </ExternalLink>{" "}
          at level AA, the standard referenced by the European Accessibility Act
          (EN 301 549).
        </p>

        <h2>What we do</h2>
        <ul>
          <li>
            Every feature works with a keyboard, with a visible focus indicator
            and a &ldquo;Skip to main content&rdquo; link.
          </li>
          <li>
            Pages use proper headings, landmarks and labels, so screen readers
            can navigate them.
          </li>
          <li>
            Text and controls meet WCAG AA color contrast in both the light and
            dark themes.
          </li>
          <li>
            Pages reflow on small screens and when zoomed to 400%, without
            sideways scrolling.
          </li>
          <li>
            Animations are reduced when your device asks for reduced motion.
          </li>
          <li>Links that open in a new tab say so to screen reader users.</li>
          <li>
            Each page is checked with automated accessibility testing (axe) and
            by keyboard.
          </li>
        </ul>

        <h2>Known limitations</h2>
        <ul>
          <li>
            <strong>YouTube&apos;s player</strong> in the Embed Code Generator
            preview is made by YouTube, and we can&apos;t control its
            accessibility. The generated code itself follows best practice,
            including a descriptive title.
          </li>
          <li>
            <strong>The Thumbnail Previewer</strong> is about how images look,
            which is visual by nature. Its size and format checks are also given
            as text, and every control works by keyboard.
          </li>
        </ul>

        <h2>Report a problem</h2>
        <p>
          If something doesn&apos;t work for you, please tell us and we&apos;ll
          fix it or give you the information another way. Contact{" "}
          {legal.operator.email}, open an issue on{" "}
          <ExternalLink href={siteConfig.links.issues}>GitHub</ExternalLink>, or
          reach us on{" "}
          <ExternalLink href={siteConfig.links.discord}>Discord</ExternalLink>.
          We aim to reply within 5 working days.
        </p>
        <p>
          If you&apos;re not satisfied with our response, you can contact the
          authority responsible for accessibility enforcement in your country.
        </p>
      </Prose>
    </div>
  );
}
