"use client";

import Image from "next/image";
import { YouTubeDesktopHeader } from "../youtube-header";
import YouTubeTags from "../youtube-tags";
import { VideoType } from "../../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import useVideos from "../../hooks/use-videos";

export default function DesktopHome() {
  const videos = useVideos();

  return (
    <>
      <div className="sticky top-0 z-10 bg-background pt-4">
        <YouTubeDesktopHeader />
        <section>
          <YouTubeTags />
        </section>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {videos.filter(Boolean).map((video) => (
          <VideoItem key={video.videoId} video={video} />
        ))}
      </section>
    </>
  );
}

function VideoItem({ video }: { video: VideoType }) {
  return (
    <article>
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
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="font-semibold leading-tight text-ellipsis whitespace-normal text-lg">
            {video.title}
          </h3>
          <p className="text-muted-foreground leading-tight">
            <span className="block">{video.channelTitle}</span>
            <span>
              {video.views} views • {video.publishedAt}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}
