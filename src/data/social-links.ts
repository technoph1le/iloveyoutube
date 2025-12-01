import { DISCORD_URL, GITHUB_URL, YOUTUBE_URL } from "@/lib/constants";
import { FaDiscord, FaGithub, FaYoutube } from "react-icons/fa";

export const SOCIAL_LINKS = [
  {
    label: "GitHub",
    url: GITHUB_URL,
    icon: FaGithub,
  },
  {
    label: "Discord",
    url: DISCORD_URL,
    icon: FaDiscord,
  },
  {
    label: "YouTube",
    url: YOUTUBE_URL,
    icon: FaYoutube,
  },
];
