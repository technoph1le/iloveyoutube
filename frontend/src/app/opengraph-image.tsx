import { siteConfig } from "@/data/site";
import { ogImage, ogSize } from "@/utils/og-image";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("Every YouTube tool in one place", siteConfig.tagline);
}
