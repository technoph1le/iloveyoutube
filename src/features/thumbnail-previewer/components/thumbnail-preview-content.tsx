"use client";

import YouTubeHeader from "./youtube-header";
import YouTubeTags from "./youtube-tags";
import YouTubeVideoCards from "./youtube-video-cards";

export function DesktopHome() {
  return (
    <>
      <div className="sticky top-0 z-10 bg-background pt-4">
        <YouTubeHeader />
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
        <YouTubeHeader />
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
    <>
      <div className="sticky top-0 z-10 bg-background pt-4">
        <YouTubeHeader />
        <section>
          <YouTubeTags />
        </section>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <YouTubeVideoCards orientation="horizontal" />
      </section>
    </>
  );
}

export function ChannelPage() {
  return (
    <>
      <div className="sticky top-0 z-10 bg-background pt-4">
        <YouTubeHeader />
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

export function DesktopSidebar() {
  return (
    <>
      <div className="sticky top-0 z-10 bg-background pt-4">
        <YouTubeHeader />
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
