"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import type { VideoCardType } from "../types";
import { THUMBNAIL_PREVIEW_CATEGORIES } from "../data";

const defaultValue: ContextType = {
  title: "",
  setTitle: () => {},
  thumbnail: "",
  setThumbnail: () => {},
  channel: "",
  setChannel: () => {},
  category: "all",
  setCategory: () => {},
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
      }}
    >
      {children}
    </ThumbnailPreviewContext.Provider>
  );
};
