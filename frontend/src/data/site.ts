// Site-wide settings and links. Edit freely; everything else reads from here.

export const GITHUB_URL = "https://github.com/technoph1le/iloveyoutube";
export const SPONSOR_URL = "https://ko-fi.com/technoph1le";
export const DISCORD_URL = "https://discord.gg/Nm5K46yUy5";
export const YOUTUBE_URL = "https://youtube.com/@technoph1le";

export const siteConfig = {
  name: "iLoveYouTube",
  // Canonical address used in metadata, the sitemap and social previews.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.iloveyoutube.dev",
  tagline: "Free online YouTube tools for creators and viewers",
  description:
    "Free, online YouTube tools for creators and viewers. Preview thumbnails on every screen, download thumbnails in full resolution, and generate embed code. No account needed.",
  author: { name: "Technophile", url: YOUTUBE_URL },
  // Year the site launched, shown in the footer copyright notice.
  copyrightYear: 2026,
  links: {
    github: GITHUB_URL,
    sponsor: SPONSOR_URL,
    discord: DISCORD_URL,
    youtube: YOUTUBE_URL,
    issues: `${GITHUB_URL}/issues`,
  },
  // Main navigation in the header.
  nav: [
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/faqs", label: "FAQs" },
    { href: "/sponsor", label: "Sponsor" },
  ],
  // Secondary links in the footer.
  footerNav: [
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/faqs", label: "FAQs" },
    { href: "/sponsor", label: "Sponsor" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Use" },
    { href: "/accessibility", label: "Accessibility" },
  ],
};
