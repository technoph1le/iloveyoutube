import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { FAQ_ITEMS } from "@/lib/constants";

export default function Page() {
  return (
    <section>
      <div className="wrapper py-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">FAQ</h1>
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
