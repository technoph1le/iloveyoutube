"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { YouTubeDesktopHeader } from "../widgets/youtube-header";
import Image from "next/image";
import { VideoType } from "../../types";
import useVideos from "../../hooks/use-videos";

export default function DesktopSidebar() {
  const videos = useVideos();

  return (
    <>
      <div className="sticky top-0 z-10 bg-background py-4">
        <YouTubeDesktopHeader />
      </div>
      <div className="grid gap-4 grid-cols-[2fr_1fr] py-4">
        <section>
          <AspectRatio
            ratio={16 / 9}
            className="w-full h-full rounded-xl overflow-hidden"
          >
            <Image
              src="/assets/video-placeholder2.jpg"
              alt="Video placeholder"
              fill
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </section>
        <section className="grid gap-2">
          {videos.map((video) => (
            <VideoItem key={video.thumbnail} video={video} />
          ))}
        </section>
      </div>
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
          <h3 className="font-semibold leading-tight text-base">
            {video.title}
          </h3>
          <p className="text-muted-foreground leading-tight">
            {video.views} views • {video.publishedAt}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <p className="text-muted-foreground leading-tight">
            {video.channelTitle}
          </p>
        </div>
      </div>
    </article>
  );
}
