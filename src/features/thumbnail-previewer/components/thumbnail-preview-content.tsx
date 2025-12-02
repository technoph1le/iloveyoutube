"use client";

import Image from "next/image";
import { YouTubeDesktopHeader, YouTubeMobileHeader } from "./youtube-header";
import YouTubeTags from "./youtube-tags";
import YouTubeVideoCards from "./youtube-video-cards";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import YouTubeProfile from "./youtube-profile";

export function DesktopHome() {
  return (
    <>
      <div className="sticky top-0 z-10 bg-background pt-4">
        <YouTubeDesktopHeader />
        <section>
          <YouTubeTags />
        </section>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <YouTubeVideoCards />
      </section>
    </>
  );
}

export function DesktopSearch() {
  return (
    <>
      <div className="sticky top-0 z-10 bg-background pt-4">
        <YouTubeDesktopHeader />
        <section className="">
          <YouTubeTags />
        </section>
      </div>
      <section className="grid gap-4">
        <YouTubeVideoCards orientation="horizontal" />
      </section>
    </>
  );
}

export function MobileFeed() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="sticky top-0 z-10 bg-background pt-4">
        <YouTubeMobileHeader />
        <section>
          <YouTubeTags />
        </section>
      </div>
      <section className="grid gap-6">
        <YouTubeVideoCards orientation="vertical" variant="mobile" />
      </section>
    </div>
  );
}

export function ChannelPage() {
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
          <YouTubeVideoCards withoutAvatar={true} withoutChannel={true} />
        </section>
      </div>
    </>
  );
}

export function DesktopSidebar() {
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
          <YouTubeVideoCards
            orientation="horizontal"
            withoutDescription={true}
            variant="mobile"
            withoutAvatar={true}
            withoutTags={true}
          />
        </section>
      </div>
    </>
  );
}
