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
            Support this project to ensure its core features remain free.
          </SectionSubtitle>
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
