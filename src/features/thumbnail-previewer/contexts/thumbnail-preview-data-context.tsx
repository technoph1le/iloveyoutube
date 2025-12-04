"use client";

import { createContext, ReactNode, useRef, useState } from "react";
import { ThumbnailPreviewDataContextType, VideoCardType } from "../types";

export const ThumbnailPreviewDataContext =
  createContext<ThumbnailPreviewDataContextType>({
    videos: [],
    setVideos: () => {},

    handleShuffle: () => {},
  });

export const ThumbnailPreviewDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [videos, setVideos] = useState<VideoCardType[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  function handleShuffle() {
    const shuffledVideos = [...videos].sort(() => 0.5 - Math.random());
    setVideos(shuffledVideos);
  }

  return (
    <ThumbnailPreviewDataContext.Provider
      value={{
        videos,
        setVideos,
        handleShuffle,
      }}
    >
      {children}
    </ThumbnailPreviewDataContext.Provider>
  );
};
