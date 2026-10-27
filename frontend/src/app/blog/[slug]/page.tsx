import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/ui/json-ld";
import { Prose } from "@/components/ui/prose";
import { SupportCard } from "@/components/ui/support-card";
import { getPost, postSlugs } from "@/data/blog";
import { siteConfig } from "@/data/site";
import { formatDate } from "@/utils/format-date";
import { absoluteUrl, pageMetadata } from "@/utils/seo";

export function generateStaticParams() {
  return postSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const base = pageMetadata({ title: post.title, description: post.description, path: `/blog/${slug}` });
  const image = { url: `/blog/${slug}/opengraph-image`, width: 1200, height: 630, alt: post.title };
  return {
    ...base,
    authors: [siteConfig.author],
    // Article type and dates help search engines and AI answers show how
    // current the post is.
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [siteConfig.author.name],
      images: [image],
    },
    twitter: { ...base.twitter, images: [image.url] },
  };
}

// Every post is prerendered from generateStaticParams, so the fallback only
// shows if a navigation starts before the post's page has been prefetched.
export default function Page({ params }: PageProps<"/blog/[slug]">) {
  return (
    <div className="px-4 py-12 sm:py-16">
      <Suspense fallback={<PostSkeleton />}>
        <Post params={params} />
      </Suspense>
    </div>
  );
}

async function Post({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const url = absoluteUrl(`/blog/${slug}`);
  const { Content } = post;

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              headline: post.title,
              description: post.description,
              url,
              mainEntityOfPage: url,
              image: [absoluteUrl(post.cover.src), `${url}/opengraph-image`],
              datePublished: post.publishedAt,
              dateModified: post.updatedAt ?? post.publishedAt,
              inLanguage: "en",
              author: { "@type": "Person", name: siteConfig.author.name, url: siteConfig.author.url },
              publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Blog", item: absoluteUrl("/blog") },
                { "@type": "ListItem", position: 2, name: post.title, item: url },
              ],
            },
          ],
        }}
      />
      <header className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground">
            ← Blog
          </Link>
        </nav>
        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-muted-foreground">
          By {siteConfig.author.name} · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.updatedAt && (
            <>
              {" "}
              · Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
            </>
          )}
        </p>
      </header>
      <Prose>
        <Content />
      </Prose>
      <SupportCard />
    </article>
  );
}

function PostSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse" aria-hidden>
      <div className="h-5 w-16 rounded bg-muted" />
      <div className="mt-6 h-12 w-full rounded bg-muted" />
      <div className="mt-4 h-5 w-64 rounded bg-muted" />
      <div className="mt-12 aspect-video w-full rounded-xl bg-muted" />
    </div>
  );
}
