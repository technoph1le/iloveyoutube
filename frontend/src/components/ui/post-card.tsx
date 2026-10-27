import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/data/blog";
import { formatDate } from "@/utils/format-date";

// Same card look as ToolCard, with the post's cover image on top.
// `heading` is h3 where the cards sit under a section heading (home page).
export function PostCard({ post, preload, heading: Heading = "h2" }: { post: Post; preload?: boolean; heading?: "h2" | "h3" }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-muted-foreground/60 hover:bg-muted"
    >
      <Image
        src={post.cover}
        alt={post.coverAlt}
        placeholder="blur"
        preload={preload}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-video w-full border-b border-border object-cover object-top"
      />
      <article className="flex flex-1 flex-col p-6">
        <p className="text-sm text-muted-foreground">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
        <Heading className="mt-2 text-[1.35rem] font-bold leading-tight group-hover:text-brand">{post.title}</Heading>
        <p className="mt-3 line-clamp-3 text-[1.05rem] leading-relaxed text-muted-foreground">{post.description}</p>
      </article>
    </Link>
  );
}
