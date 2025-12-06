"use client";

import { ShuffleIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { THUMBNAIL_PREVIEW_OPTIONS } from "../../data/thumbnail-preview-options";
import { memo, ReactNode, useContext } from "react";
import { ThumbnailPreviewDataContext } from "../../contexts/thumbnail-preview-data-context";

export default function ThumbnailPreviewOptions() {
  const { handleShuffle } = useContext(ThumbnailPreviewDataContext);

  return (
    <Tabs defaultValue="desktopHome" className="w-full">
      <div className="flex flex-wrap gap-4 items-center justify-center w-fit mx-auto">
        <TabsList className="h-auto flex-wrap">
          {Object.entries(THUMBNAIL_PREVIEW_OPTIONS).map(
            ([key, { icon: Icon, ...option }]) => (
              <TabsTrigger key={key} value={key} className="px-4 py-2">
                <Icon />
                {option.label}
              </TabsTrigger>
            )
          )}
        </TabsList>
        <Button onClick={handleShuffle} variant="outline" size="lg">
          <ShuffleIcon /> Shuffle
        </Button>
      </div>
      {Object.entries(THUMBNAIL_PREVIEW_OPTIONS).map(
        ([key, { content: Content }]) => (
          <TabsContent key={key} value={key} className="py-4 min-h-screen">
            <MemoizedContent>
              <Content />
            </MemoizedContent>
          </TabsContent>
        )
      )}
    </Tabs>
  );
}

const MemoizedContent = memo(({ children }: { children: ReactNode }) => (
  <>{children}</>
));

MemoizedContent.displayName = "MemoizedContent";
