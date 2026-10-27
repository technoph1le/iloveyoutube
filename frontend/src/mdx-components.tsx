import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { ExternalLink } from "@/components/ui/external-link";
import { Figure } from "@/components/ui/figure";

// How markdown elements render in blog posts. Styling comes from <Prose>;
// these only swap in the right link component and keep wide tables scrollable.
// <Figure> is available in every post without an import.
const components: MDXComponents = {
  Figure,
  a: ({ href = "", children }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <ExternalLink href={href}>{children}</ExternalLink>
    ),
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-base">{children}</table>
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
