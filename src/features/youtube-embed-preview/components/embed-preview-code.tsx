"use client";

import { useContext } from "react";
import { EmbedPreviewContext } from "../contexts/embed-preview-context";
import { getEmbedCode } from "../utils/get-embed-code";
import { extractYouTubeId } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function EmbedPreviewCode() {
  const {
    videoURL,
    isAutoplay,
    isLoop,
    isMute,
    hasControls,
    startTime,
    endTime,
  } = useContext(EmbedPreviewContext);

  const embedCodeSrc = getEmbedCode({
    videoId: extractYouTubeId(videoURL) || "o3UU9TjDV4g",
    isAutoplay,
    isLoop,
    isMute,
    hasControls,
    startTime,
    endTime,
  });

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <iframe
          width="560"
          height="315"
          src={embedCodeSrc}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>

        <Card>
          <CardContent className="overflow-x-auto">
            {/* allow lines breaks */}
            <pre className="break-all whitespace-pre-wrap">
              {`<iframe
  width="560"
  height="315"
  src="${embedCodeSrc}"
  title="YouTube video player"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerPolicy="strict-origin-when-cross-origin"
  allowFullScreen
></iframe>`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
