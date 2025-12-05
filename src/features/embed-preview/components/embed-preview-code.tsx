"use client";

import { Suspense, useContext } from "react";
import { EmbedPreviewContext } from "../contexts/embed-preview-context";
import { getEmbedCode } from "../utils/get-embed-code";
import { extractYouTubeId } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import useCopyClipboard from "../hooks/use-copy-clipboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmbedPreviewCode() {
  const {
    videoURL,
    isAutoplay,
    isLoop,
    isMute,
    hasControls,
    isResponsive,
    startTime,
    endTime,
  } = useContext(EmbedPreviewContext);
  const { isCopied, copyToClipboard } = useCopyClipboard();

  const { iframeSrc, iframeCode } = getEmbedCode({
    videoId: extractYouTubeId(videoURL) || "o3UU9TjDV4g",
    isAutoplay,
    isLoop,
    isMute,
    hasControls,
    isResponsive,
    startTime,
    endTime,
  });

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 items-center">
        <div className="relative w-full aspect-video">
          <Suspense fallback={<Skeleton className="w-full aspect-video" />}>
            <iframe
              width="100%"
              height="100%"
              src={iframeSrc}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{ position: "absolute", inset: 0 }}
            ></iframe>
          </Suspense>
        </div>

        <Card className="relative">
          <Button
            size="icon"
            variant="outline"
            onClick={() => copyToClipboard(iframeCode)}
            className="absolute top-2 right-2 z-10"
          >
            {isCopied ? <CheckIcon /> : <CopyIcon />}
          </Button>

          <CardContent className="overflow-x-auto">
            <pre className="break-all whitespace-pre-wrap">{iframeCode}</pre>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
