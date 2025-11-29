import { LucideProps } from "lucide-react";

export type FeatureItem = {
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
  link: string;
  published?: boolean;
};

export type FeatureItemKey =
  | "thumbnailDownloader"
  | "thumbnailPreviewer"
  | "youtubeToMp3"
  | "youtubeToMp4"
  | "safeZoneOverlay"
  | "chaptersGenerator"
  | "titleFormatter"
  | "videoScreenshot";

export type FeatureItems = Record<FeatureItemKey, FeatureItem>;
