import { Heart } from "lucide-react";
import { ExternalLink } from "@/components/ui/external-link";
import { siteConfig } from "@/data/site";

// Shown below every blog post.
export function SupportCard() {
  return (
    <aside
      aria-labelledby="support-title"
      className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-card p-8 text-center"
    >
      <Heart className="mx-auto size-8 fill-brand text-brand" aria-hidden />
      <h2 id="support-title" className="mt-4 text-2xl font-bold">
        Found this useful?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
        iLoveYouTube is free, with no ads and no sign-up. A coffee on Ko-fi helps keep the tools and guides coming.
      </p>
      <ExternalLink
        href={siteConfig.links.sponsor}
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-brand-strong px-5 text-[1.05rem] font-medium text-white transition-opacity hover:opacity-90"
      >
        <Heart className="size-5" aria-hidden />
        Support on Ko-fi
      </ExternalLink>
    </aside>
  );
}
