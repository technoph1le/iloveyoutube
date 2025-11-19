import {
  Download,
  Image as ImageIcon,
  Scissors,
  Type,
  Video,
  Music,
  ListOrdered,
  PanelsTopLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import React from "react";

const FEATURE_ITEMS = [
  {
    icon: <Download />,
    title: "Thumbnail Downloader",
    description: "Grab any YouTube thumbnail in full resolution.",
    link: "/thumbnail-downloader",
  },
  {
    icon: <ImageIcon />,
    title: "Thumbnail Previewer",
    description: "See how your thumbnail looks on mobile, desktop, and TV.",
    link: "/thumbnail-previewer",
  },
  {
    icon: <Music />,
    title: "YouTube to MP3",
    description: "Convert YouTube videos into clean, high-quality audio.",
    link: "/youtube-to-mp3",
  },
  {
    icon: <Video />,
    title: "YouTube to MP4",
    description: "Download YouTube videos in MP4 format instantly.",
    link: "/youtube-to-mp4",
  },
  {
    icon: <ListOrdered />,
    title: "Chapters Generator",
    description: "Turn transcripts into clean, ready-to-paste video chapters.",
    link: "/chapters-generator",
  },
  {
    icon: <Type />,
    title: "Title & Description Formatter",
    description:
      "Beautify your titles and descriptions with proper formatting.",
    link: "/title-formatter",
  },
  {
    icon: <Scissors />,
    title: "Video Screenshot Tool",
    description: "Extract crisp frames from any YouTube video.",
    link: "/video-screenshot",
  },
  {
    icon: <PanelsTopLeft />,
    title: "Safe Zones Overlay",
    description: "Check if text or faces get covered by YouTube UI elements.",
    link: "/thumbnail-safe-zone",
  },
];

export default function Features() {
  return (
    <ul className="grid gap-4 md:grid-cols-4">
      {FEATURE_ITEMS.map((feature) => (
        <li key={feature.title}>
          <Link href={feature.link}>
            <Card className="hover:outline-1 h-full">
              <CardContent className="space-y-4">
                {React.cloneElement(feature.icon, { size: 42 })}
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
