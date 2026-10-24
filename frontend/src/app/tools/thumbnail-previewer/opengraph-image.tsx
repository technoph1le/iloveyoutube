import { getTool } from "@/data/tools";
import { ogImage, ogSize } from "@/utils/og-image";

const tool = getTool("thumbnail-previewer")!;

export const alt = tool.metaTitle ?? tool.title;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage(tool.title, tool.description);
}
