import { Metadata } from "next";
import { FEATURES } from "@/data/features";

import { ThumbnailPreviewDataProvider } from "@/features/thumbnail-previewer/contexts/thumbnail-preview-data-context";
import { ThumbnailPreviewFormProvider } from "@/features/thumbnail-previewer/contexts/thumbnail-preview-form-context";

const data = FEATURES.thumbnailPreviewer;

export const metadata: Metadata = {
  title: `${data.title} | iLoveYouTube`,
  description: data.description,
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThumbnailPreviewFormProvider>
      <ThumbnailPreviewDataProvider>{children}</ThumbnailPreviewDataProvider>
    </ThumbnailPreviewFormProvider>
  );
}
