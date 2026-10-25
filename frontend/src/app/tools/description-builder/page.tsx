import { ToolPage, toolMetadata } from "@/components/layout/tool-page";
import { getTool } from "@/data/tools";
import { DescriptionBuilder } from "@/features/description-builder/description-builder";

const tool = getTool("description-builder")!;

export const metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage tool={tool}>
      <DescriptionBuilder />
    </ToolPage>
  );
}
