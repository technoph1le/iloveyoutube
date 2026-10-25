import { ToolPage, toolMetadata } from "@/components/layout/tool-page";
import { getTool } from "@/data/tools";
import { ApiSandbox } from "@/features/api-sandbox/api-sandbox";

const tool = getTool("api-sandbox")!;

export const metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage tool={tool}>
      <ApiSandbox />
    </ToolPage>
  );
}
