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
  | "youtubeTranscript"
  | "chaptersGenerator"
  | "titleFormatter"
  | "videoScreenshot"
  | "embedPreview"
  | "safeZoneOverlay"
  | "crossPostPreview"
  | "apiSandbox";

export type FeatureItems = Record<FeatureItemKey, FeatureItem>;
