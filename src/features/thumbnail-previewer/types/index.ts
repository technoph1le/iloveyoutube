import { THUMBNAIL_PREVIEW_CATEGORIES } from "@/features/thumbnail-previewer/data/thumbnail-preview-categories";
import { Dispatch, FormEvent, RefObject, SetStateAction } from "react";

export type VideoCardType = {
  title: string;
  channel: string;
  thumbnail: string;
};

export type OEmbedResponse = {
  title: string;
  author_name: string;
  thumbnail_url: string;
};

export interface YouTubeVideoCardProps {
  orientation?: "horizontal" | "vertical";
  variant?: "mobile" | "desktop";
  withoutAvatar?: boolean;
  withoutChannel?: boolean;
  withoutDescription?: boolean;
  withoutTags?: boolean;
}

export interface ThumbnailPreviewContextType {
  title: VideoCardType["title"];
  setTitle: Dispatch<SetStateAction<string>>;
  thumbnail: VideoCardType["thumbnail"];
  setThumbnail: Dispatch<SetStateAction<string>>;
  channel: VideoCardType["channel"];
  setChannel: Dispatch<SetStateAction<string>>;
  category: keyof typeof THUMBNAIL_PREVIEW_CATEGORIES;
  setCategory: Dispatch<
    SetStateAction<ThumbnailPreviewContextType["category"]>
  >;
  error: string;
  previewRef: RefObject<HTMLDivElement | null>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
}
