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
          <SectionTitle>Sponsor</SectionTitle>
          <SectionSubtitle>
            Support this project to make it stay free forever.
          </SectionSubtitle>
        </SectionHeader>
      </div>
    </section>
  );
}
