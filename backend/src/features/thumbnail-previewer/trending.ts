// Fetches YouTube's trending ("most popular") videos per category with the
// YouTube Data API v3. A full refresh costs roughly 15 quota units.

const API = "https://www.googleapis.com/youtube/v3";

export const CATEGORIES = [
  { id: "all", label: "All", youtubeId: null },
  { id: "music", label: "Music", youtubeId: "10" },
  { id: "gaming", label: "Gaming", youtubeId: "20" },
  { id: "entertainment", label: "Entertainment", youtubeId: "24" },
  { id: "sports", label: "Sports", youtubeId: "17" },
  { id: "news", label: "News", youtubeId: "25" },
  { id: "film", label: "Film & Animation", youtubeId: "1" },
  { id: "tech", label: "Science & Tech", youtubeId: "28" },
  { id: "education", label: "Education", youtubeId: "27" },
  { id: "howto", label: "How-to & Style", youtubeId: "26" },
  { id: "comedy", label: "Comedy", youtubeId: "23" },
] as const;

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
  const byId = new Map<string, FeedVideo>();
  const available: { id: string; label: string }[] = [];

  for (const category of CATEGORIES) {
    let items: VideoItem[];
    try {
      const data = await get<{ items: VideoItem[] }>(
        "videos",
        {
          part: "snippet,contentDetails,statistics",
          chart: "mostPopular",
          regionCode: region,
          maxResults: "24",
          ...(category.youtubeId ? { videoCategoryId: category.youtubeId } : {}),
        },
        apiKey,
      );
      items = data.items;
    } catch (err) {
      // Some categories have no chart in some regions; skip them, but a
      // failing "all" chart (bad key, quota) fails the whole refresh.
      if (!category.youtubeId) throw err;
      console.warn(`Skipping category ${category.id}: ${(err as Error).message}`);
      continue;
    }
    if (!items.length) continue;
    available.push({ id: category.id, label: category.label });

    for (const item of items) {
      const existing = byId.get(item.id);
      if (existing) {
        if (!existing.categories.includes(category.id)) existing.categories.push(category.id);
        continue;
      }
      byId.set(item.id, {
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
        categories: [category.id],
      });
    }
  }

  // Channel avatars, 50 channels per request.
  const videos = [...byId.values()];
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
    categories: available,
    videos: videos.filter((v) => v.thumbnail),
  };
}
