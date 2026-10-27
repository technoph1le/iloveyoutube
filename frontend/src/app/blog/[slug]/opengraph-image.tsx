import { getPost, postSlugs } from "@/data/blog";
import { ogImage, ogSize } from "@/utils/og-image";

export function generateStaticParams() {
  return postSlugs.map((slug) => ({ slug }));
}

export const alt = "iLoveYouTube blog post";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return ogImage(post?.title ?? "Blog", "iLoveYouTube blog");
}
