"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DownloadIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useThumbnailDownloadProps } from "../hooks/useThumbnailDownload";

export default function ThumbnailDownloadPreview({
  thumbnails,
}: useThumbnailDownloadProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Object.entries(thumbnails).map(([key, thumbnail], index) => (
        <Card
          key={key}
          className={cn(
            "pt-0 overflow-hidden",
            index === 0 && "md:col-span-2" // first item spans full width
          )}
        >
          <AspectRatio ratio={16 / 9}>
            <Image
              key={thumbnail.url}
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
  );
}
