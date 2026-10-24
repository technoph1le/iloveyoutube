import { Suspense } from "react";
import { ToolPage, toolMetadata } from "@/components/layout/tool-page";
import { getTool } from "@/data/tools";
import { ThumbnailDownloader } from "@/features/thumbnail-downloader/thumbnail-downloader";

const tool = getTool("thumbnail-downloader")!;

export const metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage tool={tool}>
      {/* Reads ?v= so a result can be shared as a link. */}
      <Suspense>
        <ThumbnailDownloader />
      </Suspense>
    </ToolPage>
  );
}
