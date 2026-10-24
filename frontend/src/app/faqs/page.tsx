import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ExternalLink } from "@/components/ui/external-link";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { faqGroups, type Faq } from "@/data/faqs";
import { siteConfig } from "@/data/site";
import { pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Frequently asked questions",
  description:
    "Answers about iLoveYouTube: pricing, privacy, thumbnail sizes, reusing thumbnails, and embedding YouTube videos on your website.",
  path: "/faqs",
});

function FaqLink({ link }: { link: NonNullable<Faq["link"]> }) {
  const className =
    "mt-2 inline-block font-medium underline underline-offset-4 hover:text-brand";
  return link.href.startsWith("/") ? (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  ) : (
    <ExternalLink href={link.href} className={className}>
      {link.label}
    </ExternalLink>
  );
}

export default function Page() {
  return (
    <div className="px-4 py-12 sm:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqGroups.flatMap((group) =>
            group.items.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          ),
        }}
      />
      <PageHeader
        title="Frequently asked questions"
        description="Can't find an answer? Ask us on Discord."
      />

      <div className="mx-auto mt-12 max-w-3xl">
        {faqGroups.map((group) => (
          <section
            key={group.title}
            aria-labelledby={`faq-${group.title}`}
            className="mt-10 first:mt-0"
          >
            <h2 id={`faq-${group.title}`} className="text-2xl font-bold">
              {group.title}
            </h2>
            <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
              {group.items.map((faq) => (
                <details key={faq.question} className="group px-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                    <h3>{faq.question}</h3>
                    <ChevronDown
                      className="size-5 shrink-0 transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <div className="pb-5 leading-relaxed text-muted-foreground">
                    <p>{faq.answer}</p>
                    {faq.link && <FaqLink link={faq.link} />}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
        <p className="mt-12 text-center text-muted-foreground">
          Still stuck?{" "}
          <ExternalLink
            href={siteConfig.links.discord}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Ask on Discord
          </ExternalLink>{" "}
          or{" "}
          <ExternalLink
            href={siteConfig.links.issues}
            className="font-medium text-foreground underline underline-offset-4"
          >
            open an issue on GitHub
          </ExternalLink>
          .
        </p>
      </div>
    </div>
  );
}
