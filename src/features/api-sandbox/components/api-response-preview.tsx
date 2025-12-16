import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClipboardButton from "@/components/widgets/clipboard-button";

const RESPONSE_SAMPLE = `[
  {
    label: "About",
    url: "/about",
  },
  {
    label: "FAQs",
    url: "/faqs",
  },
  {
    label: "Sponsor",
    url: "/sponsor",
  },
  {
    label: "Pricing",
    url: "/pricing",
  },
];`;

export default function ApiResponsePreview() {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Response preview</h3>
      <ScrollArea className="h-72 w-full rounded-md border">
        <Card>
          <ClipboardButton copy={RESPONSE_SAMPLE} />
          <CardContent>
            <pre>{RESPONSE_SAMPLE}</pre>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
