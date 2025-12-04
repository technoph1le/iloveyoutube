import {
  LayoutPanelLeftIcon,
  MonitorIcon,
  SearchIcon,
  SmartphoneIcon,
  UserSquareIcon,
} from "lucide-react";

import DesktopHome from "../components/previews/_desktop-home";
import DesktopSearch from "../components/previews/_desktop-search";
import MobileFeed from "../components/previews/_mobile-feed";
import ChannelPage from "../components/previews/_channel-page";
import DesktopSidebar from "../components/previews/_desktop-sidebar";

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
