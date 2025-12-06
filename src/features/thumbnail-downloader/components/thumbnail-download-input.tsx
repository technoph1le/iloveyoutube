"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import { ArrowRightIcon, CircleXIcon } from "lucide-react";
import { useThumbnailDownloadProps } from "../hooks/useThumbnailDownload";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ThumbnailDownloadInput({
  videoURL,
  setVideoURL,
  error,
  handleClear,
  handleSubmit,
}: useThumbnailDownloadProps) {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup className="max-w-lg mx-auto h-auto">
        <InputGroupInput
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
          placeholder="Paste the YouTube video URL"
          required
          className="md:text-base h-auto py-2 px-4"
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
  );
}
