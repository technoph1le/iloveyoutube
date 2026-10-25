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
    metaTitle: "YouTube Thumbnail Downloader (HD, Full Resolution)",
    metaDescription:
      "Download any YouTube video thumbnail in every size, from Full HD 1280×720 down to 120×90, as JPG or WebP. Free, fast, no sign-up.",
  },
  {
    slug: "thumbnail-previewer",
    title: "Thumbnail Previewer",
    description:
      "See how your thumbnail looks on mobile, desktop, and TV. Also, A/B test your thumbnails.",
    icon: Image,
    isDisplayed: true,
    metaTitle: "YouTube Thumbnail Previewer & Tester",
    metaDescription:
      "Test your YouTube thumbnail and title in a realistic feed on home, search, mobile and TV before you publish. Compare A/B versions. Free and private.",
  },
  {
    slug: "embed-code-generator",
    title: "Embed Code Generator",
    description:
      "Customize a YouTube player for your website, see it live, and copy the code.",
    icon: CodeXml,
    isDisplayed: true,
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
    slug: "description-builder",
    title: "Description Builder",
    description:
      "Drop in your transcript and get a title, description, chapters and hashtags, with your links added, ready to copy.",
    icon: ListOrdered,
    isDisplayed: true,
    isNew: true,
    metaTitle: "AI YouTube Description & Chapters Generator",
    metaDescription:
      "Turn a video transcript into a YouTube title, description, chapters and hashtags with AI. Add your links and socials, check YouTube's limits, and copy. Free.",
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
    description:
      "Check if text or faces get covered by YouTube's buttons and badges on thumbnails, Shorts and banners.",
    icon: PanelsTopLeft,
    isDisplayed: true,
    isNew: true,
    metaTitle: "YouTube Safe Zones Overlay (Shorts, Thumbnails, Banners)",
    metaDescription:
      "See where YouTube's buttons, captions and badges cover your Shorts, thumbnails, videos and channel art. Download free safe zone templates. Private, in your browser.",
  },
  {
    slug: "cross-platform-preview",
    title: "Cross-Platform Post Preview",
    description:
      "Preview how your thumbnails look across Instagram, X, TikTok, and more.",
    icon: GalleryVertical,
    isDisplayed: false,
  },
  {
    slug: "api-sandbox",
    title: "YouTube API Sandbox",
    description:
      "Try YouTube Data API requests, see the real response, and copy ready-made code. No Postman required.",
    icon: Code,
    isDisplayed: true,
    isNew: true,
    metaTitle: "YouTube Data API Sandbox (Online API Tester)",
    metaDescription:
      "Test YouTube Data API v3 requests in your browser: videos, channels, playlists, comments and search. See the JSON response and copy cURL, JavaScript or Python code.",
  },
];

export const displayedTools = tools.filter((tool) => tool.isDisplayed);

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
