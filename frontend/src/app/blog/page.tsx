import { JsonLd } from "@/components/ui/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { PostCard } from "@/components/ui/post-card";
import { getPosts } from "@/data/blog";
import { siteConfig } from "@/data/site";
import { absoluteUrl, pageMetadata } from "@/utils/seo";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Practical guides for YouTube creators: image sizes, thumbnails, safe zones, descriptions, embedding and the YouTube API.",
  path: "/blog",
});

export default async function Page() {
  const posts = await getPosts();

  return (
    <div className="py-12 sm:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${siteConfig.name} Blog`,
          url: absoluteUrl("/blog"),
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: absoluteUrl(`/blog/${post.slug}`),
            datePublished: post.publishedAt,
            image: absoluteUrl(post.cover.src),
          })),
        }}
      />
      <div className="px-4">
        <PageHeader title="Blog" description="Practical guides for making and sharing YouTube videos." />
      </div>

      <ul className="mx-auto mt-12 grid w-full max-w-[1600px] grid-cols-1 gap-5 px-4 sm:grid-cols-2 sm:px-10 lg:grid-cols-3 xl:px-5">
        {posts.map((post, i) => (
          <li key={post.slug} className="flex">
            {/* The first row is above the fold. */}
            <PostCard post={post} preload={i < 3} />
          </li>
        ))}
      </ul>
    </div>
  );
}
