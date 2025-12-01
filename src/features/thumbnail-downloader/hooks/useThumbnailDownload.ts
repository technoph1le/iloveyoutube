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
  error: string | null;
  handleClear: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  handleDownload: () => void;
}

export function useThumbnailDownload(): useThumbnailDownloadProps {
  const updateThumbnailCount = useMutation(api.stats.updateThumbnailCount);
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

  // to prevent spamming and only allow clicking after 10 seconds.
  const throttleUpdateThumbnailCount = useMemo(() => {
    return throttle(() => updateThumbnailCount(), 10000);
  }, [updateThumbnailCount]);

  const handleDownload = () => {
    try {
      throttleUpdateThumbnailCount();
    } catch (error) {
      console.error(error);
      setError("An error occured. Please try again later.");
    }
  };

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
    handleDownload,
    handleClear,
    handleSubmit,
  };
}
