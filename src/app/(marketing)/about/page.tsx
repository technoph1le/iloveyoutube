import {
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
} from "@/components/ui/section";
import { PAGES } from "@/data/pages";

export default function Page() {
  const data = PAGES.about;

  return (
    <section>
      <div className="wrapper py-8">
        <SectionHeader>
          <SectionTitle>{data.title}</SectionTitle>
          <SectionSubtitle>{data.description}</SectionSubtitle>
        </SectionHeader>
      </div>
    </section>
  );
}
