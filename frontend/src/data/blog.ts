import fs from "node:fs";
import path from "node:path";
import type { MDXContent } from "mdx/types";
import type { StaticImageData } from "next/image";

// Blog posts live in src/content/blog as <slug>.mdx. Each file exports a
// `metadata` object of this shape; nothing else needs registering.

export type PostMeta = {
  title: string;
  // Shown in search results and AI answers, so make it a complete answer.
  description: string;
  // ISO dates, "2026-10-27".
  publishedAt: string;
  updatedAt?: string;
  // Featured posts are shown on the home page (the first 3).
  featured?: boolean;
  // Card image on /blog, imported in the post: `import cover from "./<slug>/cover.png"`.
  cover: StaticImageData;
  coverAlt: string;
};

export type Post = PostMeta & { slug: string; Content: MDXContent };

const POSTS_DIR = path.join(process.cwd(), "src/content/blog");

export const postSlugs = fs
  .readdirSync(POSTS_DIR)
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => file.replace(/\.mdx$/, ""));

export async function getPost(slug: string): Promise<Post | undefined> {
  if (!postSlugs.includes(slug)) return undefined;
  const mod = await import(`@/content/blog/${slug}.mdx`);
  return { slug, ...mod.metadata, Content: mod.default };
}

// Newest first.
export async function getPosts() {
  const posts = await Promise.all(postSlugs.map((slug) => getPost(slug)));
  return posts
    .filter((post): post is Post => post !== undefined)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

// Featured posts first, topped up with the newest, so there are always enough.
export async function getFeaturedPosts(count = 3) {
  const posts = await getPosts();
  return [...posts.filter((p) => p.featured), ...posts.filter((p) => !p.featured)].slice(0, count);
}
