import { DISCORD_URL, GITHUB_URL, YOUTUBE_URL } from "@/lib/constants";
import Link from "next/link";
import React from "react";
import { FaDiscord, FaGithub, FaYoutube } from "react-icons/fa";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    url: GITHUB_URL,
    icon: <FaGithub />,
  },
  {
    label: "Discord",
    url: DISCORD_URL,
    icon: <FaDiscord />,
  },
  {
    label: "YouTube",
    url: YOUTUBE_URL,
    icon: <FaYoutube />,
  },
];

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-6">
      {SOCIAL_LINKS.map((link) => (
        <Link
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {React.cloneElement(link.icon, { size: 22 })}
          <span className="sr-only">{link.label}</span>
        </Link>
      ))}
    </div>
  );
}
