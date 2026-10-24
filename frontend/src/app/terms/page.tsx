import Link from "next/link";
import { ExternalLink } from "@/components/ui/external-link";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";
import { legal } from "@/data/legal";
import { siteConfig } from "@/data/site";
import { formatDate } from "@/utils/format-date";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The rules for using iLoveYouTube's free tools, including your responsibilities around YouTube content.",
  path: "/terms",
});

export default function Page() {
  return (
    <div className="px-4 py-12 sm:py-16">
      <PageHeader
        title="Terms of Use"
        description={`Last updated ${formatDate(legal.termsUpdated)}`}
      />
      <Prose>
        <h2>1. About these terms</h2>
        <p>
          These terms apply to your use of {siteConfig.name} at {siteConfig.url}{" "}
          (the &ldquo;service&rdquo;), provided by {legal.operator.name}. By
          using the service you agree to them. If you don&apos;t agree, please
          don&apos;t use it.
        </p>

        <h2>2. The service</h2>
        <p>
          {siteConfig.name} offers free tools for working with YouTube. No
          account is needed. We may add, change or remove tools at any time, and
          the service may sometimes be unavailable.
        </p>

        <h2>3. Using it fairly</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            use the service for anything unlawful, or to infringe anyone&apos;s
            rights;
          </li>
          <li>
            overload the service, for example with automated bulk requests, or
            try to break, bypass or probe its security;
          </li>
          <li>
            use the service in a way that breaks YouTube&apos;s Terms of
            Service.
          </li>
        </ul>

        <h2>4. YouTube content and copyright</h2>
        <p>
          Thumbnails, videos, titles and channel details belong to their
          creators and are provided by YouTube. We don&apos;t own them and
          don&apos;t grant you any rights to them. You&apos;re responsible for
          how you use content obtained through the service: for example,
          republishing someone else&apos;s thumbnail usually needs their
          permission. If you believe content shown through the service infringes
          your rights, contact us and we&apos;ll look into it promptly.
        </p>
        <p>
          Embedded players are provided by YouTube and are subject to the{" "}
          <ExternalLink href="https://www.youtube.com/t/terms">
            YouTube Terms of Service
          </ExternalLink>
          .
        </p>

        <h2>5. Not affiliated with YouTube</h2>
        <p>
          {siteConfig.name} is an independent project. It isn&apos;t affiliated
          with, endorsed by or sponsored by YouTube or Google. YouTube is a
          trademark of Google LLC.
        </p>

        <h2>6. Open source</h2>
        <p>
          The source code is published on{" "}
          <ExternalLink href={siteConfig.links.github}>GitHub</ExternalLink>{" "}
          under the license stated in the repository. That license, not these
          terms, governs your use of the code.
        </p>

        <h2>7. No warranty</h2>
        <p>
          The service is free and provided &ldquo;as is&rdquo;. We work to keep
          it accurate and available but can&apos;t promise that it will always
          be error-free, uninterrupted or suitable for a particular purpose.
        </p>

        <h2>8. Liability</h2>
        <p>
          To the extent the law allows, we aren&apos;t liable for indirect
          losses or for losses caused by your use of content obtained through
          the service. Nothing in these terms limits liability for intent or
          gross negligence, for injury to life, body or health, or any other
          liability that can&apos;t be limited by law. If you&apos;re a
          consumer, these terms don&apos;t affect your mandatory rights under
          the law of the country where you live.
        </p>

        <h2>9. Changes and governing law</h2>
        <p>
          We may update these terms; the date at the top shows the latest
          version. These terms are governed by the laws of {legal.governingLaw},
          without depriving consumers of the protection of the mandatory laws of
          their country of residence.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about these terms: {legal.operator.email}. How we handle
          data is explained in our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </Prose>
    </div>
  );
}
