import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsPanel,
  TabsTab,
  TabsTrigger,
} from "@/components/ui/tabs";
import ClipboardButton from "@/components/widgets/clipboard-button";

export default function ApiCodeSnippet() {
  const CODE_SNIPPETS = [
    {
      key: "js",
      lang: "JavaScript",
      code: `console.log("hey there");`,
    },
    {
      key: "axios",
      lang: "Axios",
      code: `console.log("axios");`,
    },
    {
      key: "py",
      lang: "Python",
      code: `print("hey there")`,
    },
    {
      key: "curl",
      lang: "Curl",
      code: `curl https://api.google.com`,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Code Snippet</h3>
      <Tabs defaultValue="js">
        <TabsList variant="underline">
          {CODE_SNIPPETS.map((snippet) => (
            <TabsTab key={snippet.key} value={snippet.key}>
              {snippet.lang}
            </TabsTab>
          ))}
        </TabsList>
        {CODE_SNIPPETS.map((snippet) => (
          <TabsPanel key={snippet.key} value={snippet.key}>
            <Card className="relative">
              <ClipboardButton copy={snippet.code} />
              <CardContent>
                <pre>{snippet.code}</pre>
              </CardContent>
            </Card>
          </TabsPanel>
        ))}
      </Tabs>
    </div>
  );
}
