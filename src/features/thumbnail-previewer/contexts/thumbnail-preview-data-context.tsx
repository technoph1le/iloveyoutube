"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ThumbnailPreviewDataContextType, VideoType } from "../types";
import { useQuery } from "convex/react";
import { api } from "@/convex/api";
import { ThumbnailPreviewFormContext } from "./thumbnail-preview-form-context";

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
  const featuredVideos = useQuery(
    api.queries.thumbnailPreviewer.getFeaturedVideos
  ) as VideoType[];
  const [videos, setVideos] = useState<VideoType[]>(featuredVideos ?? []);
  const { userVideo } = useContext(ThumbnailPreviewFormContext);

  useEffect(() => {
    if (featuredVideos) setVideos(featuredVideos);
  }, [featuredVideos]);

  // after user submits the thumbnail, add it to videos list
  useEffect(() => {
    if (!userVideo) return;

    setVideos((prev) => {
      return [userVideo, ...prev];
    });
  }, [userVideo]);

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
