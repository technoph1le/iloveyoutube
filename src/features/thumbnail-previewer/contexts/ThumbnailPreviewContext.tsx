"use client";

import {
  createContext,
  Dispatch,
  FormEvent,
  ReactNode,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import type { VideoCardType } from "../types";
import { THUMBNAIL_PREVIEW_CATEGORIES } from "../data/thumbnail-preview-categories";

const defaultValue: ContextType = {
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

interface ContextType {
  title: VideoCardType["title"];
  setTitle: Dispatch<SetStateAction<string>>;
  thumbnail: VideoCardType["thumbnail"];
  setThumbnail: Dispatch<SetStateAction<string>>;
  channel: VideoCardType["channel"];
  setChannel: Dispatch<SetStateAction<string>>;
  category: keyof typeof THUMBNAIL_PREVIEW_CATEGORIES;
  setCategory: Dispatch<SetStateAction<ContextType["category"]>>;
  error: string;
  previewRef: RefObject<HTMLDivElement | null>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
}

export const ThumbnailPreviewContext = createContext<ContextType>(defaultValue);

export const ThumbnailPreviewProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [channel, setChannel] = useState("");
  const [category, setCategory] = useState<ContextType["category"]>("all");
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
