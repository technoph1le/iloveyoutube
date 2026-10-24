// Shapes returned by GET /api/thumbnail-previewer/feed (see backend/src/youtube.ts).
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

// A card in a preview: the creator's own video, a trending one, or a
// placeholder when the feed isn't available.
export type Card =
  | { kind: "mine"; key: string }
  | { kind: "feed"; key: string; video: FeedVideo }
  | { kind: "placeholder"; key: string };

export type Mine = {
  thumbnail: string | null;
  title: string;
  channel: string;
  avatar: string | null;
  views: number;
  duration: string;
};

// 1234 -> "1.2K", 12345 -> "12K", 1234567 -> "1.2M" (YouTube's style).
export function formatViews(n: number) {
  if (n < 1000) return `${n} ${n === 1 ? "view" : "views"}`;
  const units: [number, string][] = [
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];
  for (const [size, suffix] of units) {
    if (n >= size) {
      const value = n / size;
      const shown = value < 10 ? Math.floor(value * 10) / 10 : Math.floor(value);
      return `${shown}${suffix} views`;
    }
  }
  return `${n} views`;
}

// Age relative to when the feed was fetched, so a week-old cache still reads
// like a fresh feed ("2 days ago" rather than "9 days ago").
export function formatAge(publishedAt: string, now: string) {
  const seconds = Math.max(0, (Date.parse(now) - Date.parse(publishedAt)) / 1000);
  const steps: [number, string][] = [
    [365 * 86400, "year"],
    [30 * 86400, "month"],
    [7 * 86400, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [size, unit] of steps) {
    const value = Math.floor(seconds / size);
    if (value >= 1) return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
  }
  return "Just now";
}

export function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

// Small seeded PRNG so "Shuffle" is repeatable and SSR/CSR agree.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Shuffles the feed and places the creator's video somewhere in the first
// `slotRange` positions, the way it might land in a real feed.
export function buildCards(
  videos: FeedVideo[] | null,
  count: number,
  seed: number,
  slotRange: number,
): Card[] {
  const random = mulberry32(seed);
  const others: Card[] = videos
    ? [...videos]
        .map((video) => ({ video, sort: random() }))
        .sort((a, b) => a.sort - b.sort)
        .slice(0, count - 1)
        .map(({ video }) => ({ kind: "feed", key: video.id, video }))
    : Array.from({ length: count - 1 }, (_, i) => ({ kind: "placeholder", key: `p${i}` }));
  const slot = Math.floor(random() * Math.min(slotRange, others.length + 1));
  others.splice(slot, 0, { kind: "mine", key: "mine" });
  return others;
}
