"use client";

import { createContext, FormEvent, ReactNode, useRef, useState } from "react";
import { ThumbnailPreviewContextType } from "../types";

const defaultValue: ThumbnailPreviewContextType = {
  title: "",
  setTitle: () => {},
  thumbnail: "",
  setThumbnail: () => {},
  channel: "",
  setChannel: () => {},
  category: "all",
  setCategory: () => {},
  error: "",
  previewRef: { current: null },
  handleSubmit: () => {},
  handleReset: () => {},
};

export const ThumbnailPreviewContext =
  createContext<ThumbnailPreviewContextType>(defaultValue);

export const ThumbnailPreviewProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [channel, setChannel] = useState("");
  const [category, setCategory] =
    useState<ThumbnailPreviewContextType["category"]>("all");
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!thumbnail) {
      setError("Please upload an image.");
      return;
    }

    previewRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleReset() {
    setThumbnail("");
    setTitle("");
    setChannel("");
    setError("");
  }

  return (
    <ThumbnailPreviewContext.Provider
      value={{
        title,
        setTitle,
        thumbnail,
        setThumbnail,
        channel,
        setChannel,
        category,
        setCategory,
        error,
        handleSubmit,
        handleReset,
        previewRef,
      }}
    >
      {children}
    </ThumbnailPreviewContext.Provider>
  );
};
