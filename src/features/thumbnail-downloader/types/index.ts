export type ThumbnailDownloadVariant = {
  width: number;
  height: number;
  label: string;
  url: string;
};

export type ThumbnailDownloadVariantKey =
  | "default"
  | "medium"
  | "high"
  | "standard"
  | "maxres";

export type ThumbnailDownloadVariants = Record<
  ThumbnailDownloadVariantKey,
  ThumbnailDownloadVariant
>;
