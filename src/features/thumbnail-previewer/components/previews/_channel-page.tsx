"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { YouTubeDesktopHeader } from "../youtube-header";
import Image from "next/image";
import YouTubeProfile from "../youtube-profile";
import { VideoCardType } from "../../types";
import useVideos from "../../hooks/use-videos";

export default function ChannelPage() {
  const videos = useVideos();

  return (
    <>
      <div className="sticky top-0 z-10 bg-background py-4">
        <YouTubeDesktopHeader />
      </div>
      <div className="wrapper">
        <section>
          <AspectRatio
            ratio={2560 / 423}
            className="w-full rounded-3xl overflow-hidden"
          >
            <Image
              src="/assets/banner-placeholder.jpg"
              alt="Banner placeholder"
              fill
            />
          </AspectRatio>
        </section>
        <section>
          <YouTubeProfile />
        </section>
        <section className="wrapper grid gap-4 py-4 sm:grid-cols-3 md:grid-cols-5">
          {videos.map((video) => (
            <VideoItem key={video.thumbnail} video={video} />
          ))}
        </section>
      </div>
    </>
  );
}

function VideoItem({ video }: { video: VideoCardType }) {
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
        <div className="space-y-1">
          <h3 className="font-semibold  leading-tight text-ellipsis whitespace-normal text-base">
            {video.title}
          </h3>
          <p className="text-muted-foreground leading-tight">
            <span>36k views • 1 week ago</span>
          </p>
        </div>
      </div>
    </article>
  );
}
