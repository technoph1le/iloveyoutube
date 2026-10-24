import { ToolPage, toolMetadata } from "@/components/layout/tool-page";
import { getTool } from "@/data/tools";
import { ThumbnailPreviewer } from "@/features/thumbnail-previewer/thumbnail-previewer";

const tool = getTool("thumbnail-previewer")!;

export const metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage tool={tool}>
      <ThumbnailPreviewer />
    </ToolPage>
  );
}
