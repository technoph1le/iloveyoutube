"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { ArrowRightIcon, CircleXIcon } from "lucide-react";

import { useThumbnailDownload } from "@/features/thumbnail-downloader/hooks/useThumbnailDownload";
import ThumbnailDownloadPreview from "@/features/thumbnail-downloader/components/thumbnail-download-preview";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FEATURES } from "@/data/features";
import {
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
} from "@/components/ui/section";

export default function Page() {
  const {
    videoURL,
    setVideoURL,
    thumbnails,
    error,
    handleClear,
    handleSubmit,
  } = useThumbnailDownload();
  const sectionInfo = FEATURES["thumbnailDownloader"];

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <section>
      <div className="wrapper-xs py-8 space-y-8">
        <SectionHeader>
          <SectionTitle>{sectionInfo.title}</SectionTitle>
          <SectionSubtitle>{sectionInfo.description}</SectionSubtitle>
        </SectionHeader>
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
                <InputGroupButton
                  type="reset"
                  onClick={handleClear}
                  aria-label="Clear URL"
                >
                  <CircleXIcon />
                </InputGroupButton>
              )}
              <InputGroupButton type="submit" aria-label="Download thumbnails">
                <ArrowRightIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>

        {thumbnails && <ThumbnailDownloadPreview thumbnails={thumbnails} />}
      </div>
    </section>
  );
}
