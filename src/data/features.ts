import type { FeatureItems } from "@/types/features";
import {
  DownloadIcon,
  ImageIcon,
  ScissorsIcon,
  TypeIcon,
  VideoIcon,
  MusicIcon,
  ListOrderedIcon,
  PanelsTopLeftIcon,
} from "lucide-react";

export const FEATURES: FeatureItems = {
  thumbnailDownloader: {
    icon: DownloadIcon,
    title: "Thumbnail Downloader",
    description: "Grab any YouTube thumbnail in full resolution.",
    link: "/thumbnail-downloader",
    published: true,
  },
  thumbnailPreviewer: {
    icon: ImageIcon,
    title: "Thumbnail Previewer",
    description: "See how your thumbnail looks on mobile, desktop, and TV.",
    link: "/thumbnail-previewer",
  },
  youtubeToMp3: {
    icon: MusicIcon,
    title: "YouTube to MP3",
    description: "Convert YouTube videos into clean, high-quality audio.",
    link: "/youtube-to-mp3",
  },
  youtubeToMp4: {
    icon: VideoIcon,
    title: "YouTube to MP4",
    description: "Download YouTube videos in MP4 format instantly.",
    link: "/youtube-to-mp4",
  },
  safeZoneOverlay: {
    icon: PanelsTopLeftIcon,
    title: "Safe Zones Overlay",
    description: "Check if text or faces get covered by YouTube UI elements.",
    link: "/thumbnail-safe-zone",
  },
  chaptersGenerator: {
    icon: ListOrderedIcon,
    title: "Chapters Generator",
    description: "Turn transcripts into clean, ready-to-paste video chapters.",
    link: "/chapters-generator",
  },
  titleFormatter: {
    icon: TypeIcon,
    title: "Title & Description Formatter",
    description:
      "Beautify your titles and descriptions with proper formatting.",
    link: "/title-formatter",
  },
  videoScreenshot: {
    icon: ScissorsIcon,
    title: "Video Screenshot Tool",
    description: "Extract crisp frames from any YouTube video.",
    link: "/video-screenshot",
  },
};
