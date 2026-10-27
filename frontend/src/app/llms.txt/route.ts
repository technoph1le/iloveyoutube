import { getPosts } from "@/data/blog";
import { siteConfig } from "@/data/site";
import { displayedTools } from "@/data/tools";
import { absoluteUrl } from "@/utils/seo";

// A plain-text map of the site for AI assistants (the llms.txt convention,
// https://llmstxt.org). Built from the same data as the pages, so it stays current.
export async function GET() {
  const posts = await getPosts();
  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Tools",
    "",
    ...displayedTools.map(
      (tool) => `- [${tool.title}](${absoluteUrl(`/tools/${tool.slug}`)}): ${tool.metaDescription ?? tool.description}`,
    ),
    "",
    "## Guides",
    "",
    ...posts.map((post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.description}`),
    "",
    "## About",
    "",
    `- [About](${absoluteUrl("/about")})`,
    `- [FAQs](${absoluteUrl("/faqs")})`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
