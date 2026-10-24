import {
  Code,
  CodeXml,
  Download,
  FileText,
  GalleryVertical,
  Image,
  ListOrdered,
  PanelsTopLeft,
  Scissors,
  Type,
  type LucideIcon,
} from "lucide-react";

export type Tool = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  // Hidden tools don't appear anywhere (home, sitemap) until they're built.
  isDisplayed: boolean;
  isNew?: boolean;
  // Search-result title and description; fall back to title/description.
  metaTitle?: string;
  metaDescription?: string;
};

export const tools: Tool[] = [
  {
    slug: "thumbnail-downloader",
    title: "Thumbnail Downloader",
    description: "Grab any YouTube thumbnail in full resolution.",
    icon: Download,
    isDisplayed: true,
    isNew: true,
    metaTitle: "YouTube Thumbnail Downloader (HD, Full Resolution)",
    metaDescription:
      "Download any YouTube video thumbnail in every size, from Full HD 1280×720 down to 120×90, as JPG or WebP. Free, fast, no sign-up.",
  },
  {
    slug: "thumbnail-previewer",
    title: "Thumbnail Previewer",
    description: "See how your thumbnail looks on mobile, desktop, and TV.",
    icon: Image,
    isDisplayed: true,
    isNew: true,
    metaTitle: "YouTube Thumbnail Previewer & Tester",
    metaDescription:
      "Test your YouTube thumbnail and title in a realistic feed on home, search, mobile and TV before you publish. Compare A/B versions. Free and private.",
  },
  {
    slug: "embed-code-generator",
    title: "Embed Code Generator",
    description: "Customize a YouTube player for your website, see it live, and copy the code.",
    icon: CodeXml,
    isDisplayed: true,
    isNew: true,
    metaTitle: "YouTube Embed Code Generator (Responsive, Privacy-Friendly)",
    metaDescription:
      "Generate responsive YouTube embed code with autoplay, loop, start and end times, and privacy-enhanced mode. Live preview, HTML or React.",
  },
  {
    slug: "youtube-to-transcript",
    title: "YouTube to Transcript",
    description: "Get clean, ready-to-copy transcripts from any YouTube video.",
    icon: FileText,
    isDisplayed: false,
  },
  {
    slug: "chapters-generator",
    title: "Chapters Generator",
    description: "Turn transcripts into clean, ready-to-paste video chapters.",
    icon: ListOrdered,
    isDisplayed: false,
  },
  {
    slug: "title-description-formatter",
    title: "Title & Description Formatter",
    description: "Beautify your titles and descriptions with proper formatting.",
    icon: Type,
    isDisplayed: false,
  },
  {
    slug: "video-screenshot",
    title: "Video Screenshot Tool",
    description: "Extract crisp frames from any YouTube video.",
    icon: Scissors,
    isDisplayed: false,
  },
  {
    slug: "safe-zones-overlay",
    title: "Safe Zones Overlay",
    description: "Check if text or faces get covered by YouTube UI elements.",
    icon: PanelsTopLeft,
    isDisplayed: false,
  },
  {
    slug: "cross-platform-preview",
    title: "Cross-Platform Post Preview",
    description: "Preview how your thumbnails look across Instagram, X, TikTok, and more.",
    icon: GalleryVertical,
    isDisplayed: false,
  },
  {
    slug: "api-sandbox",
    title: "YouTube API Sandbox",
    description: "Test, fetch, and generate API code snippets for common tasks — no Postman required.",
    icon: Code,
    isDisplayed: false,
  },
];

export const displayedTools = tools.filter((tool) => tool.isDisplayed);

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
