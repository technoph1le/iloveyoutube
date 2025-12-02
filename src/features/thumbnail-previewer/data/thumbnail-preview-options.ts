import {
  LayoutPanelLeftIcon,
  MonitorIcon,
  SearchIcon,
  SmartphoneIcon,
  UserSquareIcon,
} from "lucide-react";

import {
  ChannelPage,
  DesktopHome,
  DesktopSearch,
  DesktopSidebar,
  MobileFeed,
} from "../components/thumbnail-preview-content";

export const THUMBNAIL_PREVIEW_OPTIONS = {
  desktopHome: {
    label: "Desktop Home",
    icon: MonitorIcon,
    content: DesktopHome,
  },
  desktopSearch: {
    label: "Desktop Search",
    icon: SearchIcon,
    content: DesktopSearch,
  },
  desktopSidebar: {
    label: "Desktop Sidebar",
    icon: LayoutPanelLeftIcon,
    content: DesktopSidebar,
  },
  mobileFeed: {
    label: "Mobile Feed",
    icon: SmartphoneIcon,
    content: MobileFeed,
  },
  channelPage: {
    label: "Channel Page",
    icon: UserSquareIcon,
    content: ChannelPage,
  },
};
