import { ListVideo, MessageCircle, Search, Tv, Video, type LucideIcon } from "lucide-react";
import { parseVideoId } from "@/utils/youtube-url";

// The YouTube Data API v3 requests the sandbox can make. Each endpoint lists
// the fields shown in the form and turns their values into query parameters.

export const API_BASE = "https://www.googleapis.com/youtube/v3";

export type Field = {
  name: string;
  label: string;
  kind: "text" | "number" | "select" | "parts";
  initial: string;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
};

export type Values = Record<string, string>;

export type Endpoint = {
  id: string;
  group: string;
  label: string;
  summary: string;
  resource: string;
  cost: number;
  docs: string;
  fields: Field[];
  query: (values: Values) => Record<string, string>;
};

export const GROUPS: { label: string; icon: LucideIcon }[] = [
  { label: "Videos", icon: Video },
  { label: "Channels", icon: Tv },
  { label: "Playlists", icon: ListVideo },
  { label: "Comments", icon: MessageCircle },
  { label: "Search", icon: Search },
];

const DOCS = "https://developers.google.com/youtube/v3/docs";

// Example IDs so every request works the moment a key is added.
const EXAMPLE_VIDEO = "dQw4w9WgXcQ";
const EXAMPLE_CHANNEL = "UCBR8-60-B28hp2BmDPdntcQ";
const EXAMPLE_PLAYLIST = "PLMOZDTW7ZvXM";

const parts = (options: string[], initial: string[]): Field => ({
  name: "part",
  label: "Parts",
  kind: "parts",
  initial: initial.join(","),
  options: options.map((value) => ({ value, label: value })),
  help: "Which groups of fields to return. Every part costs the same, but fewer parts means a smaller response.",
});

const maxResults = (initial: number, max: number): Field => ({
  name: "maxResults",
  label: "Max results",
  kind: "number",
  initial: String(initial),
  min: 1,
  max,
  help: `1 to ${max}. Use "Next page" in the response for more.`,
});

const regionCode = (required: boolean): Field => ({
  name: "regionCode",
  label: "Region",
  kind: "text",
  initial: required ? "US" : "",
  required,
  placeholder: "US",
  help: "Two-letter country code, such as US, GB or IN.",
});

const textFormat: Field = {
  name: "textFormat",
  label: "Text format",
  kind: "select",
  initial: "plainText",
  options: [
    { value: "plainText", label: "Plain text" },
    { value: "html", label: "HTML" },
  ],
};

const videoField: Field = {
  name: "video",
  label: "Video ID or link",
  kind: "text",
  initial: EXAMPLE_VIDEO,
  required: true,
  placeholder: "https://youtu.be/…",
};

const channelIdField: Field = {
  name: "channelId",
  label: "Channel ID",
  kind: "text",
  initial: EXAMPLE_CHANNEL,
  required: true,
  placeholder: "UC…",
  help: "Starts with UC. Look it up from a @handle with Channel details.",
};

const playlistField: Field = {
  name: "playlist",
  label: "Playlist ID or link",
  kind: "text",
  initial: EXAMPLE_PLAYLIST,
  required: true,
  placeholder: "PL…",
};

function videoIds(input: string) {
  return input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => parseVideoId(part) ?? part)
    .join(",");
}

function channelId(input: string) {
  const text = input.trim();
  return text.match(/\/channel\/(UC[\w-]{22})/)?.[1] ?? text;
}

function playlistId(input: string) {
  const text = input.trim();
  return text.match(/[?&]list=([\w-]+)/)?.[1] ?? text;
}

// A channel by ID, @handle, or a link to either.
function channelLookup(input: string): Record<string, string> {
  const text = input.trim();
  const handle = text.match(/(?:^|youtube\.com\/)(@[\w.-]+)/)?.[1];
  return handle ? { forHandle: handle } : { id: channelId(text) };
}

// Drops empty values so they don't appear in the URL.
function compact(query: Record<string, string | undefined>) {
  return Object.fromEntries(Object.entries(query).filter(([, v]) => v)) as Record<string, string>;
}

const searchOrder = (extra: { value: string; label: string }[]): Field => ({
  name: "order",
  label: "Sort by",
  kind: "select",
  initial: "relevance",
  options: [
    { value: "relevance", label: "Relevance" },
    { value: "date", label: "Newest" },
    ...extra,
  ],
});

const searchQuery = (initial: string): Field => ({
  name: "q",
  label: "Search for",
  kind: "text",
  initial,
  required: true,
});

const SEARCH_NOTE = "Search is expensive: each request costs 100 of your 10,000 daily quota units.";

export const ENDPOINTS: Endpoint[] = [
  {
    id: "video-details",
    group: "Videos",
    label: "Video details",
    summary: "Title, description, duration, view and like counts for one or more videos.",
    resource: "videos",
    cost: 1,
    docs: `${DOCS}/videos/list`,
    fields: [
      { ...videoField, help: "Up to 50, separated by commas." },
      parts(
        ["snippet", "contentDetails", "statistics", "status", "topicDetails", "player", "liveStreamingDetails", "localizations"],
        ["snippet", "contentDetails", "statistics"],
      ),
    ],
    query: (v) => ({ part: v.part, id: videoIds(v.video) }),
  },
  {
    id: "most-popular",
    group: "Videos",
    label: "Most popular videos",
    summary: "The trending chart for a country, optionally narrowed to one category.",
    resource: "videos",
    cost: 1,
    docs: `${DOCS}/videos/list`,
    fields: [
      regionCode(true),
      {
        name: "videoCategoryId",
        label: "Category ID",
        kind: "text",
        initial: "",
        placeholder: "10",
        help: "Optional, such as 10 for Music or 20 for Gaming. Find IDs with Video categories.",
      },
      maxResults(10, 50),
      parts(["snippet", "contentDetails", "statistics"], ["snippet", "statistics"]),
    ],
    query: (v) =>
      compact({
        part: v.part,
        chart: "mostPopular",
        regionCode: v.regionCode.trim().toUpperCase(),
        videoCategoryId: v.videoCategoryId.trim(),
        maxResults: v.maxResults,
      }),
  },
  {
    id: "video-categories",
    group: "Videos",
    label: "Video categories",
    summary: "The category names and IDs available in a country, such as Music or Gaming.",
    resource: "videoCategories",
    cost: 1,
    docs: `${DOCS}/videoCategories/list`,
    fields: [regionCode(true)],
    query: (v) => ({ part: "snippet", regionCode: v.regionCode.trim().toUpperCase() }),
  },
  {
    id: "channel-details",
    group: "Channels",
    label: "Channel details",
    summary: "Name, description, subscriber and video counts, and the uploads playlist of a channel.",
    resource: "channels",
    cost: 1,
    docs: `${DOCS}/channels/list`,
    fields: [
      {
        name: "channel",
        label: "Channel ID, @handle or link",
        kind: "text",
        initial: "@YouTube",
        required: true,
        placeholder: "@handle",
      },
      parts(
        ["snippet", "statistics", "contentDetails", "brandingSettings", "topicDetails", "status", "localizations"],
        ["snippet", "statistics"],
      ),
    ],
    query: (v) => ({ part: v.part, ...channelLookup(v.channel) }),
  },
  {
    id: "channel-uploads",
    group: "Channels",
    label: "Channel uploads",
    summary:
      "A channel's latest videos. Every channel keeps its uploads in a playlist whose ID is the channel ID with UC swapped for UU.",
    resource: "playlistItems",
    cost: 1,
    docs: `${DOCS}/playlistItems/list`,
    fields: [channelIdField, maxResults(10, 50), parts(["snippet", "contentDetails", "status"], ["snippet", "contentDetails"])],
    query: (v) => {
      const id = channelId(v.channelId);
      return { part: v.part, playlistId: id.startsWith("UC") ? `UU${id.slice(2)}` : id, maxResults: v.maxResults };
    },
  },
  {
    id: "channel-playlists",
    group: "Channels",
    label: "Channel playlists",
    summary: "The public playlists a channel has created.",
    resource: "playlists",
    cost: 1,
    docs: `${DOCS}/playlists/list`,
    fields: [channelIdField, maxResults(10, 50), parts(["snippet", "contentDetails", "status"], ["snippet", "contentDetails"])],
    query: (v) => ({ part: v.part, channelId: channelId(v.channelId), maxResults: v.maxResults }),
  },
  {
    id: "playlist-details",
    group: "Playlists",
    label: "Playlist details",
    summary: "Title, description, owner and video count of a playlist.",
    resource: "playlists",
    cost: 1,
    docs: `${DOCS}/playlists/list`,
    fields: [playlistField, parts(["snippet", "contentDetails", "status", "player"], ["snippet", "contentDetails"])],
    query: (v) => ({ part: v.part, id: playlistId(v.playlist) }),
  },
  {
    id: "playlist-items",
    group: "Playlists",
    label: "Playlist videos",
    summary: "The videos in a playlist, in playlist order.",
    resource: "playlistItems",
    cost: 1,
    docs: `${DOCS}/playlistItems/list`,
    fields: [playlistField, maxResults(10, 50), parts(["snippet", "contentDetails", "status"], ["snippet", "contentDetails"])],
    query: (v) => ({ part: v.part, playlistId: playlistId(v.playlist), maxResults: v.maxResults }),
  },
  {
    id: "video-comments",
    group: "Comments",
    label: "Video comments",
    summary: "Top-level comments on a video, with a few replies each.",
    resource: "commentThreads",
    cost: 1,
    docs: `${DOCS}/commentThreads/list`,
    fields: [
      videoField,
      {
        name: "order",
        label: "Sort by",
        kind: "select",
        initial: "relevance",
        options: [
          { value: "relevance", label: "Top comments" },
          { value: "time", label: "Newest first" },
        ],
      },
      { name: "searchTerms", label: "Only comments containing", kind: "text", initial: "", placeholder: "Optional" },
      maxResults(20, 100),
      textFormat,
      parts(["snippet", "replies"], ["snippet", "replies"]),
    ],
    query: (v) =>
      compact({
        part: v.part,
        videoId: parseVideoId(v.video) ?? v.video.trim(),
        order: v.order,
        searchTerms: v.searchTerms.trim(),
        maxResults: v.maxResults,
        textFormat: v.textFormat,
      }),
  },
  {
    id: "comment-replies",
    group: "Comments",
    label: "Comment replies",
    summary: "All replies to one comment. Get the comment ID from Video comments (items[].id).",
    resource: "comments",
    cost: 1,
    docs: `${DOCS}/comments/list`,
    fields: [
      { name: "parentId", label: "Comment ID", kind: "text", initial: "", required: true, placeholder: "Ugz…" },
      maxResults(20, 100),
      textFormat,
    ],
    query: (v) => ({ part: "snippet", parentId: v.parentId.trim(), maxResults: v.maxResults, textFormat: v.textFormat }),
  },
  {
    id: "search-videos",
    group: "Search",
    label: "Search videos",
    summary: `Find videos by keyword, like YouTube's search box. ${SEARCH_NOTE}`,
    resource: "search",
    cost: 100,
    docs: `${DOCS}/search/list`,
    fields: [
      searchQuery("lofi hip hop"),
      searchOrder([
        { value: "viewCount", label: "Most viewed" },
        { value: "rating", label: "Highest rated" },
      ]),
      {
        name: "videoDuration",
        label: "Duration",
        kind: "select",
        initial: "any",
        options: [
          { value: "any", label: "Any" },
          { value: "short", label: "Under 4 minutes" },
          { value: "medium", label: "4 to 20 minutes" },
          { value: "long", label: "Over 20 minutes" },
        ],
      },
      regionCode(false),
      maxResults(10, 50),
    ],
    query: (v) =>
      compact({
        part: "snippet",
        type: "video",
        q: v.q,
        order: v.order,
        videoDuration: v.videoDuration === "any" ? undefined : v.videoDuration,
        regionCode: v.regionCode.trim().toUpperCase(),
        maxResults: v.maxResults,
      }),
  },
  {
    id: "search-channels",
    group: "Search",
    label: "Search channels",
    summary: `Find channels by name or topic. ${SEARCH_NOTE}`,
    resource: "search",
    cost: 100,
    docs: `${DOCS}/search/list`,
    fields: [searchQuery("cooking"), searchOrder([{ value: "videoCount", label: "Most videos" }]), maxResults(10, 50)],
    query: (v) => ({ part: "snippet", type: "channel", q: v.q, order: v.order, maxResults: v.maxResults }),
  },
  {
    id: "search-playlists",
    group: "Search",
    label: "Search playlists",
    summary: `Find playlists by keyword. ${SEARCH_NOTE}`,
    resource: "search",
    cost: 100,
    docs: `${DOCS}/search/list`,
    fields: [searchQuery("javascript tutorial"), searchOrder([]), maxResults(10, 50)],
    query: (v) => ({ part: "snippet", type: "playlist", q: v.q, order: v.order, maxResults: v.maxResults }),
  },
];

export function initialValues(endpoint: Endpoint): Values {
  return Object.fromEntries(endpoint.fields.map((f) => [f.name, f.initial]));
}

// The first problem with the form, or null when it can be sent.
export function validate(endpoint: Endpoint, values: Values): string | null {
  for (const field of endpoint.fields) {
    const value = values[field.name]?.trim() ?? "";
    if (field.required && !value) return `${field.label} is required.`;
    if (field.kind === "parts" && !value) return "Choose at least one part.";
    if (field.kind === "number" && value) {
      const n = Number(value);
      if (!Number.isInteger(n) || n < (field.min ?? -Infinity) || n > (field.max ?? Infinity)) {
        return `${field.label} must be a whole number from ${field.min} to ${field.max}.`;
      }
    }
  }
  return null;
}
