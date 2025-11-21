export type ThumbnailDownloadVariant = {
  width: number;
  height: number;
  label: string;
  url: string;
};

export type ThumbnailDownloadVariants = {
  default: ThumbnailDownloadVariant;
  medium: ThumbnailDownloadVariant;
  high: ThumbnailDownloadVariant;
  standard: ThumbnailDownloadVariant;
  maxres: ThumbnailDownloadVariant;
};
