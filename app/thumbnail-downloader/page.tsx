"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { extractYouTubeId } from "@/lib/youtube";
import { ArrowRightIcon, CircleXIcon, DownloadIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ThumbnailTypeConfig = {
  width: number;
  height: number;
  label: string;
  url: string;
};

type ThumbnailTypes = {
  default: ThumbnailTypeConfig;
  medium: ThumbnailTypeConfig;
  high: ThumbnailTypeConfig;
  standard: ThumbnailTypeConfig;
  maxres: ThumbnailTypeConfig;
};

const DEFAULT_VIDEO_URL = "https://youtu.be/H8bQYBtF4bQ?si=uSp4RaqzzzLOZp2C";

export default function Page() {
  const [videoURL, setVideoURL] = useState<string>("");
  const [thumbnails, setThumbnails] = useState<ThumbnailTypes | null>(null);

  const handleClear = () => {
    setVideoURL("");
    getThumbnails(DEFAULT_VIDEO_URL);
  };

  const getThumbnails = async (videoURL: string) => {
    const videoId = extractYouTubeId(videoURL);
    const res = await fetch(`/api/thumbnails/download?id=${videoId}`);
    const data = await res.json();
    setThumbnails(data);
  };

  const handleSubmit = async () => {
    getThumbnails(videoURL);
  };

  useEffect(() => {
    getThumbnails(DEFAULT_VIDEO_URL);
  }, []);

  return (
    <section>
      <div className="wrapper-xs py-8 space-y-8">
        <h2 className="text-3xl font-bold text-center">
          YouTube Thumbnail Downloader
        </h2>
        <InputGroup className="max-w-lg mx-auto">
          <InputGroupInput
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
            placeholder="Enter the YouTube video link"
          />
          <InputGroupAddon align="inline-end">
            {videoURL && (
              <InputGroupButton onClick={handleClear}>
                <CircleXIcon />
              </InputGroupButton>
            )}
            <InputGroupButton onClick={handleSubmit}>
              <ArrowRightIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        {/* <p>https://youtu.be/_xWAkqZOdbc?si=XP8XI8iJa2Yt7h-T</p> */}

        <div className="grid gap-4 md:grid-cols-2">
          {thumbnails &&
            Object.entries(thumbnails).map(([key, thumbnail], index) => (
              <Card
                key={key}
                className={cn(
                  "pt-0 overflow-hidden",
                  index === 0 && "md:col-span-2" // first item spans full width
                )}
              >
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={thumbnail.url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </AspectRatio>
                <CardContent className="flex items-center gap-4 justify-between">
                  <p className="font-bold">{thumbnail.label}</p>
                  <Button asChild>
                    <Link
                      download={`${thumbnail.label}.jpg`}
                      href={thumbnail.url}
                      target="_blank"
                    >
                      <DownloadIcon />
                      <span>Download</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
