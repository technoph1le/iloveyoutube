"use client";

import { ThumbnailDownloadVariants } from "@/features/thumbnail-downloader/types";
import useFetch from "@/hooks/useFetch";
import { extractYouTubeId } from "@/lib/youtube";
import { FormEvent, useCallback, useState } from "react";

export const DEFAULT_API_URL = "/api/thumbnails/download?id=H8bQYBtF4bQ";

export function useThumbnailDownload() {
  const [videoURL, setVideoURL] = useState("");
  const [apiURL, setApiURL] = useState<string | null>(DEFAULT_API_URL);

  const {
    data: thumbnails,
    loading,
    error,
  } = useFetch<ThumbnailDownloadVariants>(apiURL || "");

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const videoId = extractYouTubeId(videoURL);
      if (!videoId) {
        setApiURL(null);
        return;
      }
      setApiURL(`/api/thumbnails/download?id=${videoId}`);
    },
    [videoURL]
  );

  const handleClear = useCallback(() => {
    setVideoURL("");
    setApiURL(DEFAULT_API_URL);
  }, []);

  return {
    videoURL,
    setVideoURL,
    thumbnails,
    error,
    loading,
    handleClear,
    handleSubmit,
  };
}
