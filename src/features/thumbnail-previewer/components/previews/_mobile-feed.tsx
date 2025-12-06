"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import useVideos from "../../hooks/use-videos";
import { VideoType } from "../../types";
import { YouTubeMobileHeader } from "../widgets/youtube-header";
import YouTubeTags from "../widgets/youtube-tags";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MobileFeed() {
  const videos = useVideos();

  return (
    <div className="max-w-lg mx-auto">
      <div className="sticky top-0 z-10 bg-background pt-4">
        <YouTubeMobileHeader />
        <section>
          <YouTubeTags />
        </section>
      </div>
      <section className="grid gap-6">
        {videos.map((video) => (
          <VideoItem key={video.thumbnail} video={video} />
        ))}
      </section>
    </div>
  );
}

function VideoItem({ video }: { video: VideoType }) {
  return (
    <article key={video.thumbnail}>
      <AspectRatio
        ratio={16 / 9}
        className="w-full h-full rounded-xl overflow-hidden"
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="w-full h-full object-cover"
        />
      </AspectRatio>
      <div className="flex gap-4 items-start pt-2">
        <Avatar className="size-10 mt-1">
          <AvatarImage src={video.channelImage} alt={video.channelTitle} />
          <AvatarFallback>{video.channelTitle.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="font-semibold  leading-tight text-ellipsis whitespace-normal text-sm">
            {video.title}
          </h3>
          <p className="text-muted-foreground leading-tight">
            <span>{video.channelTitle} • </span>
            {video.views} views • {video.publishedAt}
          </p>
        </div>
      </div>
    </article>
  );
}
