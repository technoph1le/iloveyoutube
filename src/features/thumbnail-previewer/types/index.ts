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
