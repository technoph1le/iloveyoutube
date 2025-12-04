"use client";

import { useContext } from "react";

import { FEATURES } from "@/data/features";

import { ThumbnailPreviewFormContext } from "@/features/thumbnail-previewer/contexts/thumbnail-preview-form-context";
import ThumbnailPreviewOptions from "@/features/thumbnail-previewer/components/thumbnail-preview-options";
import ThumbnailPreviewForm from "@/features/thumbnail-previewer/components/thumbnail-preview-form";

import {
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
} from "@/components/ui/section";

export default function Page() {
  const { previewRef } = useContext(ThumbnailPreviewFormContext);
  const sectionInfo = FEATURES["thumbnailPreviewer"];

  return (
    <>
      <section>
        <div className="wrapper-xs py-8 space-y-8">
          <SectionHeader>
            <SectionTitle>{sectionInfo.title}</SectionTitle>
            <SectionSubtitle>{sectionInfo.description}</SectionSubtitle>
          </SectionHeader>
          <ThumbnailPreviewForm />
        </div>
      </section>
      <section>
        <div
          className="wrapper-lg py-4 space-y-8 font-youtube"
          ref={previewRef}
        >
          <ThumbnailPreviewOptions />
        </div>
      </section>
    </>
  );
}
