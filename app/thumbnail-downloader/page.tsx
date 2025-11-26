"use client";

import { ArrowRightIcon, CircleXIcon } from "lucide-react";

import { useThumbnailDownload } from "@/features/thumbnail-downloader/hooks/useThumbnailDownload";
import ThumbnailDownloadPreview from "@/features/thumbnail-downloader/components/thumbnail-download-preview";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from "sonner";

export default function Page() {
  const {
    videoURL,
    setVideoURL,
    thumbnails,
    error,
    loading,
    handleClear,
    handleSubmit,
  } = useThumbnailDownload();

  return (
    <section>
      <div className="wrapper-xs py-8 space-y-8">
        <h1 className="text-3xl font-bold text-center">
          YouTube Thumbnail Downloader
        </h1>
        <form onSubmit={handleSubmit}>
          <InputGroup className="max-w-lg mx-auto">
            <InputGroupInput
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
              placeholder="Enter the YouTube video link"
              required
            />
            <InputGroupAddon align="inline-end">
              {videoURL && (
                <InputGroupButton type="reset" onClick={handleClear}>
                  <CircleXIcon />
                </InputGroupButton>
              )}
              <InputGroupButton type="submit" disabled={loading}>
                <ArrowRightIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>

        {error && toast.error(`Error occured: ${error}`)}

        {thumbnails && <ThumbnailDownloadPreview thumbnails={thumbnails} />}
      </div>
    </section>
  );
}
