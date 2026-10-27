import Image, { type StaticImageData } from "next/image";

// An image in a blog post. `alt` describes what the image shows for screen
// reader users and search engines; `caption` is the visible note under it.
export function Figure({ src, alt, caption }: { src: StaticImageData; alt: string; caption?: string }) {
  return (
    <figure className="mt-8">
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        sizes="(min-width: 768px) 768px, 100vw"
        className="h-auto w-full rounded-xl border border-border"
      />
      {caption && <figcaption className="mt-3 text-center text-base text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
