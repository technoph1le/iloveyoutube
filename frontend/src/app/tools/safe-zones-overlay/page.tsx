import { ToolPage, toolMetadata } from "@/components/layout/tool-page";
import { getTool } from "@/data/tools";
import { SafeZonesOverlay } from "@/features/safe-zones-overlay/safe-zones-overlay";

const tool = getTool("safe-zones-overlay")!;

export const metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage tool={tool}>
      <SafeZonesOverlay />
    </ToolPage>
  );
}
