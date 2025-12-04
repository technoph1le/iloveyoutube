"use client";

import { createContext, FormEvent, ReactNode, useRef, useState } from "react";
import { ThumbnailPreviewFormContextType, VideoCardType } from "../types";

export const ThumbnailPreviewFormContext =
  createContext<ThumbnailPreviewFormContextType>({
    title: "",
    setTitle: () => {},
    thumbnail: "",
    setThumbnail: () => {},
    channel: "",
    setChannel: () => {},
    category: "all",
    setCategory: () => {},
    error: "",
    userVideo: null,
    previewRef: { current: null },
    handleSubmit: () => {},
    handleReset: () => {},
  });

export const ThumbnailPreviewFormProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [userVideo, setUserVideo] = useState<VideoCardType | null>(null);
  const [category, setCategory] =
    useState<ThumbnailPreviewFormContextType["category"]>("all");
  const [error, setError] = useState("");
  const [videos, setVideos] = useState<VideoCardType[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!thumbnail) {
      setError("Please upload an image.");
      return;
    }

    setUserVideo({
      title,
      channel,
      thumbnail,
    });

    previewRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleReset() {
    setThumbnail("");
    setTitle("");
    setChannel("");
    setError("");
  }

  function handleShuffle() {
    const shuffledVideos = [...videos].sort(() => 0.5 - Math.random());
    setVideos(shuffledVideos);
  }

  return (
    <ThumbnailPreviewFormContext.Provider
      value={{
        title,
        setTitle,
        thumbnail,
        setThumbnail,
        channel,
        setChannel,
        category,
        setCategory,
        userVideo,
        error,
        handleSubmit,
        handleReset,
        previewRef,
      }}
    >
      {children}
    </ThumbnailPreviewFormContext.Provider>
  );
};
