import { Suspense } from "react";
import { ToolPage, toolMetadata } from "@/components/layout/tool-page";
import { getTool } from "@/data/tools";
import { EmbedCodeGenerator } from "@/features/embed-code-generator/embed-code-generator";

const tool = getTool("embed-code-generator")!;

export const metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage tool={tool}>
      {/* Reads ?v= so a result can be shared as a link. */}
      <Suspense>
        <EmbedCodeGenerator />
      </Suspense>
    </ToolPage>
  );
}
