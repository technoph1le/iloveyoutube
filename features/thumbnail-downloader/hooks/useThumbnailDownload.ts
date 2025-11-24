"use client";

import { ThumbnailDownloadVariants } from "@/features/thumbnail-downloader/types";
import { extractYouTubeId } from "@/lib/youtube";
import { useCallback, useState } from "react";

export const DEFAULT_VIDEO_URL =
  "https://youtu.be/H8bQYBtF4bQ?si=uSp4RaqzzzLOZp2C";

export function useThumbnailDownload() {
  const [videoURL, setVideoURL] = useState<string>("");
  const [thumbnails, setThumbnails] =
    useState<ThumbnailDownloadVariants | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchThumbnails = useCallback(async (videoURL: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const videoId = extractYouTubeId(videoURL);
      if (!videoId) {
        setThumbnails(null);
        setError("Invalid YouTube URL — missing video id.");
        return;
      }

      const res = await fetch(`/api/thumbnails/download?id=${videoId}`);
      if (!res.ok) {
        setThumbnails(null);
        setError(`Request failed with status ${res.status}`);
        return;
      }

      const data = await res.json();
      setThumbnails(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setThumbnails(null);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    fetchThumbnails(videoURL);
  }, [videoURL, fetchThumbnails]);

  const handleClear = useCallback(() => {
    setVideoURL("");
    setError(null);
    fetchThumbnails(DEFAULT_VIDEO_URL);
  }, [fetchThumbnails]);

  return {
    videoURL,
    setVideoURL,
    thumbnails,
    error,
    setError,
    isLoading,
    fetchThumbnails,
    handleClear,
    handleSubmit,
  };
}
