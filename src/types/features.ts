import { LucideProps } from "lucide-react";
import { ComponentType } from "react";

export type FeatureItem = {
  icon: ComponentType<LucideProps>;
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
  | "videoScreenshot"
  | "youtubeTranscript"
  | "embedPreview"
  | "commentExtractor"
  | "crossPostPreview";

export type FeatureItems = Record<FeatureItemKey, FeatureItem>;
