"use client";

import { ThumbnailDownloadVariants } from "@/features/thumbnail-downloader/types";
import { extractYouTubeId } from "@/lib/youtube";
import { FormEvent, useCallback, useState } from "react";
import { DEFAULT_THUMBNAILS, getThumbnails } from "../utils/get-thumbnails";

export function useThumbnailDownload() {
  const [videoURL, setVideoURL] = useState("");
  const [thumbnails, setThumbnails] =
    useState<ThumbnailDownloadVariants>(DEFAULT_THUMBNAILS);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      const videoId = extractYouTubeId(videoURL);
      if (!videoId) {
        setError("Please enter a valid YouTube video URL");
        return;
      }
      setThumbnails(getThumbnails(videoId));
    },
    [videoURL]
  );

  const handleClear = useCallback(() => {
    setVideoURL("");
    setThumbnails(DEFAULT_THUMBNAILS);
    setError(null);
  }, []);

  return {
    videoURL,
    setVideoURL,
    thumbnails,
    error,
    handleClear,
    handleSubmit,
  };
}
