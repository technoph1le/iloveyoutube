import {
  ListCollapseIcon,
  MessageCircleMoreIcon,
  SearchIcon,
  TvIcon,
  VideoIcon,
} from "lucide-react";

export const ENDPOINT_OPTIONS = [
  {
    label: "Videos",
    icon: VideoIcon,
    items: [
      { label: "Get video details", key: "getVideoDetails" },
      { label: "Get video categories", key: "getVideoCategories" },
      { label: "Search videos", key: "searchVideos" },
    ],
  },
  {
    label: "Channels",
    icon: TvIcon,
    items: [
      { label: "Get channel details", key: "getChannelDetails" },
      { label: "Get channel statistics", key: "getChannelStatistics" },
      { label: "Search channels", key: "searchChannels" },
    ],
  },
  {
    label: "Playlists",
    icon: ListCollapseIcon,
    items: [
      { label: "Get playlist items", key: "getPlaylistItems" },
      { label: "Get playlist metadata", key: "getPlaylistMetadata" },
    ],
  },
  {
    label: "Comments",
    icon: MessageCircleMoreIcon,
    items: [
      { label: "Get comments", key: "getComments" },
      { label: "Get comment replies", key: "getCommentReplies" },
    ],
  },
  {
    label: "Search",
    icon: SearchIcon,
    items: [
      { label: "Search videos", key: "searchVideos" },
      { label: "Search channels", key: "searchChannels" },
      { label: "Search playlists", key: "searchPlaylists" },
    ],
  },
];
