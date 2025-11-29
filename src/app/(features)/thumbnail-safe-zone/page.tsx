import {
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
} from "@/components/ui/section";
import { FEATURES } from "@/data/features";

export default function Page() {
  const sectionInfo = FEATURES["safeZoneOverlay"];

  return (
    <section>
      <div className="wrapper py-8">
        <SectionHeader>
          <SectionTitle>{sectionInfo.title}</SectionTitle>
          <SectionSubtitle>{sectionInfo.description}</SectionSubtitle>
        </SectionHeader>
      </div>
    </section>
  );
}
