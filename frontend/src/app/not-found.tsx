import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <PageHeader title="Page not found" description="That page doesn't exist, or the tool isn't ready yet." />
      <Link
        href="/"
        className="mt-10 inline-flex h-11 items-center rounded-lg bg-foreground px-5 font-medium text-background transition-opacity hover:opacity-90"
      >
        See all tools
      </Link>
    </div>
  );
}
