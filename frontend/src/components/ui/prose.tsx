import type { ReactNode } from "react";

// Readable long-form text (about, legal pages): comfortable line length,
// spacing and visible link styling.
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        "mx-auto max-w-3xl text-[1.075rem] leading-relaxed",
        "[&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold",
        "[&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold",
        "[&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
        "[&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-brand",
        "[&_strong]:font-semibold",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
