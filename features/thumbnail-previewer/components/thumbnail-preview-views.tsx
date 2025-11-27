import { ShuffleIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { THUMBNAIL_PREVIEW_VIEWS } from "../data";
import { memo, ReactNode } from "react";

export default function ThumbnailPreviewViews() {
  return (
    <Tabs defaultValue="desktopHome" className="w-full">
      <div className="flex gap-4 items-center w-fit mx-auto">
        <TabsList className="h-auto">
          {Object.entries(THUMBNAIL_PREVIEW_VIEWS).map(([key, option]) => (
            <TabsTrigger key={key} value={key} className="px-4 py-2">
              {option.icon}
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button variant="outline" size="lg">
          <ShuffleIcon /> Shuffle
        </Button>
      </div>
      {Object.entries(THUMBNAIL_PREVIEW_VIEWS).map(([key, option]) => (
        <TabsContent key={key} value={key} className="py-4 min-h-screen">
          <MemoizedContent>{option.content}</MemoizedContent>
        </TabsContent>
      ))}
    </Tabs>
  );
}

const MemoizedContent = memo(({ children }: { children: ReactNode }) => (
  <>{children}</>
));
