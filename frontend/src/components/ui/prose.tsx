import type { ReactNode } from "react";

// Readable long-form text (about, legal pages, blog posts): comfortable line length,
// spacing and visible link styling.
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        "mx-auto max-w-3xl text-[1.075rem] leading-relaxed",
        "[&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold",
        "[&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold",
        "[&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
        "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.95em]",
        "[&_blockquote]:mt-6 [&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-4",
        "[&_th]:border-b [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
        "[&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
        "[&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-brand",
        "[&_strong]:font-semibold",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
