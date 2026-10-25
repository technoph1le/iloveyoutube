// Questions shown on /faqs (and given to search engines as an FAQ). Edit,
// reorder or add freely. Answers are plain text; `link` adds one link after it.

import { DISCORD_URL, GITHUB_URL } from "@/data/site";

export type Faq = {
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

export type FaqGroup = { title: string; items: Faq[] };

export const faqGroups: FaqGroup[] = [
  {
    title: "General",
    items: [
      {
        question: "Is iLoveYouTube free?",
        answer:
          "Yes. Every tool is free to use, with no account, no sign-up and no usage limits for normal use.",
      },
      {
        question: "Who is it for?",
        answer:
          "Both creators and viewers. Creators can test thumbnails before publishing and embed videos on their sites; anyone can grab a thumbnail in full resolution.",
      },
      {
        question: "Are you affiliated with YouTube or Google?",
        answer:
          "No. iLoveYouTube is an independent project and isn't affiliated with, endorsed by or sponsored by YouTube or Google. YouTube is a trademark of Google LLC.",
      },
      {
        question: "Is the project open source?",
        answer:
          "Yes. The full source code is on GitHub, and contributions are welcome.",
        link: { href: GITHUB_URL, label: "View the code on GitHub" },
      },
      {
        question: "How do I suggest a tool or report a problem?",
        answer:
          "Open an issue on GitHub or say hi in our Discord. Accessibility problems are a priority, so please tell us if anything doesn't work for you.",
        link: { href: DISCORD_URL, label: "Join the Discord" },
      },
    ],
  },
  {
    title: "Privacy",
    items: [
      {
        question: "Do you upload or store my thumbnails?",
        answer:
          "No. In the Thumbnail Previewer and Safe Zones Overlay, your images are read by your browser and never leave your device. Close the tab and they're gone.",
      },
      {
        question: "Do you use cookies or tracking?",
        answer:
          "There are no ads and no tracking cookies. The only cookie remembers whether you chose the light or dark theme. To see which tools are popular, we use Vercel Web Analytics, which counts page views without cookies and can't identify you.",
        link: { href: "/privacy", label: "Read the privacy policy" },
      },
      {
        question: "Why does the embed preview ask before loading?",
        answer:
          "The preview is YouTube's real player, which connects to Google's servers. We only load it after you agree, so nothing is shared with Google just by visiting the page.",
      },
    ],
  },
  {
    title: "Thumbnails",
    items: [
      {
        question: "Why isn't a Full HD thumbnail available for some videos?",
        answer:
          "YouTube only creates the 1280×720 version for videos uploaded in HD. Older or low-resolution videos only have the smaller sizes, and the downloader shows exactly which ones exist.",
      },
      {
        question: "Can I reuse a thumbnail I downloaded?",
        answer:
          "Thumbnails belong to the people who made them. Downloading one for reference, study or your own videos is fine; republishing someone else's thumbnail usually needs their permission.",
      },
      {
        question: "Where do the videos in the Thumbnail Previewer come from?",
        answer:
          "They're YouTube's currently trending videos, refreshed once a week, so your thumbnail is tested against what people are really seeing.",
      },
      {
        question: "What size should my thumbnail be?",
        answer:
          "YouTube recommends 1280×720 pixels (16:9), at least 640 pixels wide, under 2 MB, as JPG, PNG or GIF. The previewer checks all of this when you add an image.",
      },
      {
        question: "Where shouldn't I put text on a thumbnail or Short?",
        answer:
          "On thumbnails, avoid the bottom-right corner, where the duration badge sits. On Shorts, keep clear of the buttons on the right and the channel name and title along the bottom. The Safe Zones Overlay shows exactly what gets covered.",
        link: { href: "/tools/safe-zones-overlay", label: "Open the Safe Zones Overlay" },
      },
      {
        question: "What size should my channel banner be?",
        answer:
          "Upload 2560×1440 pixels (at least 2048×1152, under 6 MB). TVs show all of it, but phones only show the center 1546×423, so keep text and logos there.",
        link: { href: "/tools/safe-zones-overlay", label: "Check your banner" },
      },
    ],
  },
  {
    title: "Embedding",
    items: [
      {
        question: "What is privacy-enhanced mode?",
        answer:
          "It embeds the player from youtube-nocookie.com, so YouTube doesn't store cookies on your visitors' devices until they press play. It's on by default.",
      },
      {
        question: "Why doesn't autoplay work with sound?",
        answer:
          "Browsers block videos that start playing with sound on their own. Autoplay only works when the video starts muted, so the generator mutes it for you.",
      },
      {
        question: "Does the embed code work with Shorts?",
        answer:
          "Yes. Paste a Shorts link and the generator switches to a vertical 9:16 player automatically.",
      },
    ],
  },
  {
    title: "Descriptions",
    items: [
      {
        question: "How long can a YouTube description be?",
        answer:
          "Up to 5,000 characters, and it can't contain < or >. Only the first line or two show before “…more”, so put the most important information first.",
        link: { href: "/tools/description-builder", label: "Open the Description Builder" },
      },
      {
        question: "How many hashtags should I use?",
        answer:
          "Use up to 15. With more than 15, YouTube ignores all of them. The first 3 in the description appear above your title, unless the title has hashtags of its own.",
      },
      {
        question: "How does the Description Builder write my description?",
        answer:
          "You paste your video's transcript, and an AI model (Anthropic's Claude) writes a title, a description, chapters and hashtags from it, then adds your saved links. Videos under 2 minutes don't get chapters. With timestamps in the transcript, chapter times are exact; without them, they're estimated from where each topic falls in the transcript, so check them against your video. Everything stays editable.",
      },
      {
        question: "Is the AI free to use?",
        answer:
          "Yes. To keep it free for everyone, each visitor can make a limited number of AI requests per hour. Building and checking your description without AI is unlimited.",
      },
    ],
  },
  {
    title: "YouTube API",
    items: [
      {
        question: "Do I need my own API key for the API Sandbox?",
        answer:
          "Yes. A YouTube Data API key is free from the Google Cloud console and gives you 10,000 quota units a day. Requests go straight from your browser to Google, so your key never reaches our server.",
        link: { href: "https://developers.google.com/youtube/v3/getting-started", label: "How to get a key" },
      },
      {
        question: "Why does search use so much quota?",
        answer:
          "YouTube charges 100 units for each search request but only 1 unit for most other requests. To list a channel's videos cheaply, use Channel uploads instead of searching.",
        link: { href: "/tools/api-sandbox#channel-uploads", label: "Try Channel uploads" },
      },
    ],
  },
];
