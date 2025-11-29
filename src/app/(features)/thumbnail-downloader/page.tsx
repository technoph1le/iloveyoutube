"use client";

import { FEATURES } from "@/data/features";
import {
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
} from "@/components/ui/section";
import ThumbnailDownloadInput from "@/features/thumbnail-downloader/components/thumbnail-download-input";
import ThumbnailDownloadPreview from "@/features/thumbnail-downloader/components/thumbnail-download-preview";
import { useThumbnailDownload } from "@/features/thumbnail-downloader/hooks/useThumbnailDownload";

export default function Page() {
  const sectionInfo = FEATURES["thumbnailDownloader"];
  const hookProps = useThumbnailDownload();

  return (
    <section>
      <div className="wrapper-xs py-8 space-y-8">
        <SectionHeader>
          <SectionTitle>{sectionInfo.title}</SectionTitle>
          <SectionSubtitle>{sectionInfo.description}</SectionSubtitle>
        </SectionHeader>

        <ThumbnailDownloadInput {...hookProps} />

        <ThumbnailDownloadPreview {...hookProps} />
      </div>
    </section>
  );
}
