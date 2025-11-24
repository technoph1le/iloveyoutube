import {
  Monitor,
  LayoutPanelLeft,
  Search,
  Smartphone,
  UserSquare,
  Tv,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { slugify } from "@/lib/utils";

const THUMBNAIL_PREVIEW_OPTIONS = [
  {
    label: "Desktop Home",
    icon: <Monitor />,
    content: <div>Desktop Home</div>,
  },
  {
    label: "Desktop Sidebar",
    icon: <LayoutPanelLeft />,
    content: <div>Desktop Sidebar</div>,
  },
  {
    label: "Desktop Search",
    icon: <Search />,
    content: <div>Desktop Search</div>,
  },
  {
    label: "Mobile Feed",
    icon: <Smartphone />,
    content: <div>Mobile Feed</div>,
  },
  {
    label: "Mobile Search",
    icon: <Search />,
    content: <div>Mobile Search</div>,
  },
  {
    label: "Channel Page",
    icon: <UserSquare />,
    content: <div>Channel Page</div>,
  },
  {
    label: "TV Preview",
    icon: <Tv />,
    content: <div>TV Preview</div>,
  },
];

interface Props {
  imgPath: string;
  videoTitle: string;
  channelName: string;
}

export default function ThumbnailPreviewOptions({
  imgPath,
  videoTitle,
  channelName,
}: Props) {
  return (
    <Tabs
      defaultValue={slugify(THUMBNAIL_PREVIEW_OPTIONS[0].label)}
      className="w-full"
    >
      <TabsList className="h-auto w-fit mx-auto">
        {THUMBNAIL_PREVIEW_OPTIONS.map((option) => (
          <TabsTrigger
            key={option.label}
            value={slugify(option.label)}
            className="px-4 py-2"
          >
            {option.icon}
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {THUMBNAIL_PREVIEW_OPTIONS.map((option) => (
        <TabsContent key={option.label} value={slugify(option.label)}>
          {option.content}
          <p>
            {imgPath}, {videoTitle}, {channelName}
          </p>
        </TabsContent>
      ))}
    </Tabs>
  );
}
