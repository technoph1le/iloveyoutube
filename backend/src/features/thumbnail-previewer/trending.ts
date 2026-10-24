// Fetches YouTube's trending ("most popular") videos with the YouTube Data
// API v3. A full refresh costs 2 quota units.

const API = "https://www.googleapis.com/youtube/v3";

const FEED_SIZE = 40;

export type FeedVideo = {
  id: string;
  title: string;
  channelId: string;
  channelTitle: string;
  channelAvatar: string | null;
  viewCount: number;
  publishedAt: string;
  durationSeconds: number;
  isLive: boolean;
  thumbnail: string;
  categories: string[];
};

export type Feed = {
  fetchedAt: string;
  region: string;
  categories: { id: string; label: string }[];
  videos: FeedVideo[];
};

type Thumbnails = Record<string, { url: string } | undefined>;

type VideoItem = {
  id: string;
  snippet: {
    title: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    liveBroadcastContent: string;
    thumbnails: Thumbnails;
  };
  contentDetails: { duration: string };
  statistics: { viewCount?: string };
};

async function get<T>(path: string, params: Record<string, string>, apiKey: string) {
  const url = new URL(`${API}/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  url.searchParams.set("key", apiKey);
  const res = await fetch(url);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new Error(`YouTube API ${path} ${res.status}: ${body?.error?.message ?? res.statusText}`);
  }
  return (await res.json()) as T;
}

// PT1H2M3S -> 3723
function parseDuration(iso: string) {
  const m = iso.match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  const [, d = "0", h = "0", min = "0", s = "0"] = m;
  return Number(d) * 86400 + Number(h) * 3600 + Number(min) * 60 + Number(s);
}

// Largest 16:9 image first. The 4:3 sizes are letterboxed, so cropping them to
// 16:9 in the UI removes exactly the black bars.
function pickThumbnail(thumbnails: Thumbnails) {
  for (const size of ["maxres", "standard", "high", "medium", "default"]) {
    const url = thumbnails[size]?.url;
    if (url) return url;
  }
  return "";
}

export async function fetchFeed(apiKey: string, region: string): Promise<Feed> {
  const { items } = await get<{ items: VideoItem[] }>(
    "videos",
    {
      part: "snippet,contentDetails,statistics",
      chart: "mostPopular",
      regionCode: region,
      maxResults: String(FEED_SIZE),
    },
    apiKey,
  );

  const videos: FeedVideo[] = items.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    channelId: item.snippet.channelId,
    channelTitle: item.snippet.channelTitle,
    channelAvatar: null,
    viewCount: Number(item.statistics.viewCount ?? 0),
    publishedAt: item.snippet.publishedAt,
    durationSeconds: parseDuration(item.contentDetails.duration),
    isLive: item.snippet.liveBroadcastContent === "live",
    thumbnail: pickThumbnail(item.snippet.thumbnails),
    categories: ["all"],
  }));

  // Channel avatars, 50 channels per request.
  const channelIds = [...new Set(videos.map((v) => v.channelId))];
  const avatars = new Map<string, string>();
  for (let i = 0; i < channelIds.length; i += 50) {
    const data = await get<{ items: { id: string; snippet: { thumbnails: Thumbnails } }[] }>(
      "channels",
      { part: "snippet", id: channelIds.slice(i, i + 50).join(","), maxResults: "50" },
      apiKey,
    );
    for (const channel of data.items) {
      const url = channel.snippet.thumbnails.default?.url ?? channel.snippet.thumbnails.medium?.url;
      if (url) avatars.set(channel.id, url);
    }
  }
  for (const video of videos) video.channelAvatar = avatars.get(video.channelId) ?? null;

  return {
    fetchedAt: new Date().toISOString(),
    region,
    categories: [{ id: "all", label: "All" }],
    videos: videos.filter((v) => v.thumbnail),
  };
}
