import {
  Monitor,
  LayoutPanelLeft,
  Search,
  Smartphone,
  UserSquare,
  Tv,
  ShuffleIcon,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { slugify } from "@/lib/utils";
import { DesktopHome } from "./thumbnail-preview-content";
import { Button } from "@/components/ui/button";

const THUMBNAIL_PREVIEW_OPTIONS = [
  {
    label: "Desktop Home",
    icon: <Monitor />,
    content: <DesktopHome />,
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
  console.log(imgPath, videoTitle, channelName);

  return (
    <Tabs
      defaultValue={slugify(THUMBNAIL_PREVIEW_OPTIONS[0].label)}
      className="w-full"
    >
      <div className="flex gap-4 items-center w-fit mx-auto">
        <TabsList className="h-auto">
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
        <Button variant="outline" size="lg">
          <ShuffleIcon /> Shuffle
        </Button>
      </div>
      {THUMBNAIL_PREVIEW_OPTIONS.map((option) => (
        <TabsContent
          key={option.label}
          value={slugify(option.label)}
          className="py-4 min-h-screen"
        >
          {option.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
