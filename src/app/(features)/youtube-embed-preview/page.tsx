import {
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
} from "@/components/ui/section";
import { FEATURES } from "@/data/features";
import EmbedPreviewCode from "@/features/youtube-embed-preview/components/embed-preview-code";
import EmbedPreviewForm from "@/features/youtube-embed-preview/components/embed-preview-form";

export default function Page() {
  const sectionInfo = FEATURES["embedPreview"];

  return (
    <section>
      <div className="wrapper py-8">
        <SectionHeader>
          <SectionTitle>{sectionInfo.title}</SectionTitle>
          <SectionSubtitle>{sectionInfo.description}</SectionSubtitle>
        </SectionHeader>

        <EmbedPreviewForm />

        <EmbedPreviewCode />
      </div>
    </section>
  );
}
