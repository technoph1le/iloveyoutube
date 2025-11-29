import {
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
} from "@/components/ui/section";

export default function Page() {
  return (
    <section>
      <div className="wrapper py-8">
        <SectionHeader>
          <SectionTitle>About iLoveYouTube</SectionTitle>
          <SectionSubtitle>
            A little bit about me, the project and its background.
          </SectionSubtitle>
        </SectionHeader>
      </div>
    </section>
  );
}
