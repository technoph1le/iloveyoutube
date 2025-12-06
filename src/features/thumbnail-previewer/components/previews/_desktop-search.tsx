"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { YouTubeDesktopHeader } from "../youtube-header";
import YouTubeTags from "../youtube-tags";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VideoType } from "../../types";
import useVideos from "../../hooks/use-videos";

export default function DesktopSearch() {
  const videos = useVideos();

  return (
    <>
      <div className="sticky top-0 z-10 bg-background pt-4">
        <YouTubeDesktopHeader />
        <section className="">
          <YouTubeTags />
        </section>
      </div>
      <section className="grid gap-4">
        {videos.map((video) => (
          <VideoItem key={video.thumbnail} video={video} />
        ))}
      </section>
    </>
  );
}

function VideoItem({ video }: { video: VideoType }) {
  return (
    <article key={video.thumbnail} className="grid gap-4 grid-cols-[2fr_3fr]">
      <AspectRatio ratio={16 / 9} className="w-full rounded-xl overflow-hidden">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="w-full h-full object-cover"
        />
      </AspectRatio>
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-semibold leading-tight text-2xl">
            {video.title}
          </h3>
          <p className="text-muted-foreground leading-tight">
            36k views • 1 week ago
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Avatar className="size-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <p className="text-muted-foreground leading-tight">{video.channel}</p>
        </div>
        <p className="truncate overflow-hidden h-5 max-w-lg leading-tight text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam porro
          cum dolorum totam quam eveniet ipsum nesciunt veniam consequatur sed.
          Vitae alias expedita soluta quo.
        </p>

        <div className="flex gap-2">
          <Badge
            variant="secondary"
            className="rounded-xs text-base leading-none py-1 px-2"
          >
            4K
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-xs text-base leading-none py-1 px-2"
          >
            CC
          </Badge>
        </div>
      </div>
    </article>
  );
}
