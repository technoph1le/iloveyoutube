import Link from "next/link";
import type { Tool } from "@/data/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex min-h-60 w-full flex-col rounded-2xl border border-border bg-card p-8 transition-colors hover:border-muted-foreground/60 hover:bg-muted"
    >
      <Icon className="size-12 stroke-[1.75]" aria-hidden />
      <div className="mt-7 flex items-center gap-2.5">
        <h3 className="text-[1.35rem] font-bold leading-tight">{tool.title}</h3>
        {tool.isNew && (
          <span className="rounded-full bg-foreground px-2.5 py-0.5 text-sm font-medium text-background">
            New
          </span>
        )}
      </div>
      <p className="mt-6 text-[1.05rem] leading-relaxed text-muted-foreground">
        {tool.description}
      </p>
    </Link>
  );
}
