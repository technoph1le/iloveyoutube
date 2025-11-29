"use client";

import { ThumbnailDownloadVariants } from "@/features/thumbnail-downloader/types";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { DEFAULT_THUMBNAILS, getThumbnails } from "../utils/get-thumbnails";
import { extractYouTubeId, throttle } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export interface useThumbnailDownloadProps {
  videoURL: string;
  setVideoURL: Dispatch<SetStateAction<string>>;
  thumbnails: ThumbnailDownloadVariants;
  isLoading: boolean;
  error: string | null;
  handleClear: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useThumbnailDownload(): useThumbnailDownloadProps {
  const updateThumbnailCount = useMutation(api.stats.updateThumbnailCount);
  const [videoURL, setVideoURL] = useState("");
  const [thumbnails, setThumbnails] =
    useState<ThumbnailDownloadVariants>(DEFAULT_THUMBNAILS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // to prevent spamming and only allow clicking after 5 seconds.
  const throttleUpdateThumbnailCount = useMemo(() => {
    return throttle(() => updateThumbnailCount(), 5000);
  }, [updateThumbnailCount]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      const videoId = extractYouTubeId(videoURL);
      if (!videoId) {
        setIsLoading(false);
        setError("Please enter a valid YouTube video URL");
        return;
      }
      setThumbnails(getThumbnails(videoId));

      try {
        throttleUpdateThumbnailCount();
      } catch (error) {
        console.error(error);
        setError("An error occured. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [videoURL, throttleUpdateThumbnailCount]
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
    isLoading,
    error,
    handleClear,
    handleSubmit,
  };
}
