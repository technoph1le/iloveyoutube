"use client";

import { createContext, FormEvent, ReactNode, useRef, useState } from "react";
import { ThumbnailPreviewFormContextType, VideoType } from "../types";

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
  const [userVideo, setUserVideo] = useState<VideoType | null>(null);
  const [category, setCategory] =
    useState<ThumbnailPreviewFormContextType["category"]>("all");
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!thumbnail) {
      setError("Please upload an image.");
      return;
    }

    setUserVideo({
      videoId: "abcdefghijk",
      title: title,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit modi, molestiae.",
      channelTitle: channel,
      channelImage: "https://github.com/shadcn.png",
      thumbnail: thumbnail,
      publishedAt: "1 hour ago",
      views: "35k",
    });

    previewRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleReset() {
    setThumbnail("");
    setTitle("");
    setChannel("");
    setError("");
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
