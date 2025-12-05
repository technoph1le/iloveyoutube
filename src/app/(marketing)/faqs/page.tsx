import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
} from "@/components/ui/section";
import { FAQ_ITEMS } from "@/data/faqs";
import { PAGES } from "@/data/pages";

export default function Page() {
  const data = PAGES.faq;

  return (
    <section>
      <div className="wrapper py-8 space-y-6">
        <SectionHeader>
          <SectionTitle>{data.title}</SectionTitle>
          <SectionSubtitle>{data.description}</SectionSubtitle>
        </SectionHeader>
        <Accordion
          className="max-w-2xl w-full mx-auto space-y-2"
          collapsible
          defaultValue="1"
          type="single"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              className="rounded-md border bg-background px-6 py-2 outline-none last:border-b has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
              key={item.id}
              value={item.id}
            >
              <AccordionTrigger className="py-2 text-lg font-semibold leading-6 hover:no-underline focus-visible:ring-0">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="pb-2 text-base text-muted-foreground">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
