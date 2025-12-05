import {
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
} from "@/components/ui/section";
import { PAGES } from "@/data/pages";

export default function Page() {
  const data = PAGES.sponsor;

  return (
    <section>
      <div className="wrapper py-8">
        <SectionHeader>
          <SectionTitle>{data.title}</SectionTitle>
          <SectionSubtitle>{data.description}</SectionSubtitle>
        </SectionHeader>

        <p className="text-lg text-secondary-foreground mt-4">
          Your sponsorship directly funds the development and maintenance of the
          open-source iloveyoutube project, ensuring its core features remain
          free, robust, and up-to-date for everyone.
        </p>
      </div>
    </section>
  );
}
