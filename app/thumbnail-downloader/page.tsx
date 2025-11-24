"use client";

import { useEffect } from "react";
import { ArrowRightIcon, CircleXIcon } from "lucide-react";

import {
  useThumbnailDownload,
  DEFAULT_VIDEO_URL,
} from "@/features/thumbnail-downloader/hooks/useThumbnailDownload";
import ThumbnailDownloadPreview from "@/features/thumbnail-downloader/components/thumbnail-download-preview";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function Page() {
  const {
    videoURL,
    setVideoURL,
    thumbnails,
    error,
    setError,
    isLoading,
    fetchThumbnails,
    handleClear,
    handleSubmit,
  } = useThumbnailDownload();

  useEffect(() => {
    fetchThumbnails(DEFAULT_VIDEO_URL);
  }, [fetchThumbnails]);

  return (
    <section>
      <div className="wrapper-xs py-8 space-y-8">
        <h1 className="text-3xl font-bold text-center">
          YouTube Thumbnail Downloader
        </h1>
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
            <InputGroupButton onClick={handleSubmit} disabled={isLoading}>
              <ArrowRightIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        {error && (
          <Card className="max-w-lg mx-auto border border-destructive bg-destructive/10">
            <CardContent className="flex items-center justify-between gap-4">
              <p>{error}</p>
              <Button onClick={() => setError(null)}>Dismiss</Button>
            </CardContent>
          </Card>
        )}

        {thumbnails && <ThumbnailDownloadPreview thumbnails={thumbnails} />}
      </div>
    </section>
  );
}
