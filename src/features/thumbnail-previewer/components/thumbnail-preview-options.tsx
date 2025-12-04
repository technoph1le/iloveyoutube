"use client";

import { MonitorIcon, ShuffleIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { THUMBNAIL_PREVIEW_OPTIONS } from "../data/thumbnail-preview-options";
import { memo, ReactNode, useContext, useEffect } from "react";
import useIsMobile from "@/hooks/use-mobile";
import useFetch from "@/hooks/use-fetch";
import { VideoCardType } from "../types";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ThumbnailPreviewFormContext } from "../contexts/thumbnail-preview-form-context";
import { ThumbnailPreviewDataContext } from "../contexts/thumbnail-preview-data-context";

export default function ThumbnailPreviewOptions() {
  const isMobile = useIsMobile();

  const { setVideos, handleShuffle } = useContext(ThumbnailPreviewDataContext);
  const { category, userVideo } = useContext(ThumbnailPreviewFormContext);

  const { data, loading, error } = useFetch<VideoCardType[]>(
    `/api/thumbnails/preview?category=${category}`
  );

  useEffect(() => {
    if (data) {
      setVideos(userVideo ? [userVideo, ...data] : data);
    }
  }, [data, setVideos, userVideo]);

  if (loading) return <Spinner />;
  if (error) {
    toast.error(error);
    return null;
  }

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
              {isMobile ? (
                <div className="text-center py-4 space-y-4">
                  <MonitorIcon size={48} className="mx-auto" />
                  <p>You can only preview this on Desktop.</p>
                </div>
              ) : (
                <Content />
              )}
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
