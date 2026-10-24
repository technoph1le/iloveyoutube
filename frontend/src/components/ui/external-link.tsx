import type { AnchorHTMLAttributes } from "react";

// Opens in a new tab and says so to screen reader users (WCAG 3.2.5).
export function ExternalLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
