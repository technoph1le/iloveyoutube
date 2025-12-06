import { Dispatch, FormEvent, RefObject, SetStateAction } from "react";

export type VideoType = {
  videoId: string;
  title: string;
  views: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
};

export interface ThumbnailPreviewFormContextType {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  thumbnail: string;
  setThumbnail: Dispatch<SetStateAction<string>>;
  channel: string;
  setChannel: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  userVideo: VideoType | null;
  error: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
  previewRef: RefObject<HTMLDivElement | null>;
}

export interface ThumbnailPreviewDataContextType {
  videos: VideoType[];
  setVideos: Dispatch<SetStateAction<VideoType[]>>;
  handleShuffle: () => void;
}
