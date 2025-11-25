"use client";

import { useEffect, useState } from "react";
import { THUMBNAIL_PREVIEW_CATEGORIES } from "@/lib/constants";
import YouTubeHeader from "./youtube-header";
import YouTubeTags from "./youtube-tags";
import YouTubeVideoCard from "./youtube-video-card";
import { OEmbedResponse, VideoCardType } from "../types";

export function DesktopHome() {
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof THUMBNAIL_PREVIEW_CATEGORIES>("all");
  const [videos, setVideos] = useState<VideoCardType[]>([]);

  useEffect(() => {
    const fetchVideoMeta = async (videoId: string) => {
      try {
        const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("Failed to fetch video meta");

        const data: OEmbedResponse = await res.json();

        return {
          title: data.title,
          channel: data.author_name,
          thumbnail: data.thumbnail_url,
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    };

    const run = async () => {
      setVideos([]);

      const ids = THUMBNAIL_PREVIEW_CATEGORIES[activeCategory];
      const results = await Promise.all(ids.map(fetchVideoMeta));

      setVideos(results.filter(Boolean) as VideoCardType[]);
    };

    run();
  }, [activeCategory]);

  return (
    <>
      <div className="sticky top-0 z-10 bg-background pt-4">
        <YouTubeHeader />
        <section>
          <YouTubeTags
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </section>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {videos.map((video) => (
          <YouTubeVideoCard key={video.thumbnail} video={video} />
        ))}
      </section>
    </>
  );
}
