"use client";

import { useContext } from "react";
import { ThumbnailPreviewDataContext } from "../contexts/thumbnail-preview-data-context";

export default function useVideos() {
  const { videos } = useContext(ThumbnailPreviewDataContext);

  if (!videos) return [];

  return videos;
}
