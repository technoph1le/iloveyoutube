const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const HOSTS = /(^|\.)(youtube\.com|youtube-nocookie\.com)$/;
const PATH_PREFIXES = ["shorts", "embed", "live", "v", "e"];

// Extracts the 11-character video id from any common YouTube link, or a bare
// id. Returns null when there isn't one.
export function parseVideoId(input: string): string | null {
  const text = input.trim();
  if (VIDEO_ID.test(text)) return text;

  let url: URL;
  try {
    url = new URL(/^[a-z]+:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  const segments = url.pathname.split("/").filter(Boolean);

  let id: string | null | undefined;
  if (host === "youtu.be" || host === "www.youtu.be") {
    id = segments[0];
  } else if (HOSTS.test(host)) {
    id = url.searchParams.get("v") ?? (PATH_PREFIXES.includes(segments[0]) ? segments[1] : undefined);
  }
  return id && VIDEO_ID.test(id) ? id : null;
}

export type ThumbnailSize = {
  key: "maxresdefault" | "sddefault" | "hqdefault" | "mqdefault" | "default";
  label: string;
  width: number;
  height: number;
};

// Largest first. The 4:3 sizes are letterboxed for 16:9 videos.
export const THUMBNAIL_SIZES: ThumbnailSize[] = [
  { key: "maxresdefault", label: "Full HD", width: 1280, height: 720 },
  { key: "sddefault", label: "Standard", width: 640, height: 480 },
  { key: "hqdefault", label: "High", width: 480, height: 360 },
  { key: "mqdefault", label: "Medium", width: 320, height: 180 },
  { key: "default", label: "Small", width: 120, height: 90 },
];

export type ImageFormat = "jpg" | "webp";

export function thumbnailUrl(id: string, size: ThumbnailSize["key"], format: ImageFormat) {
  return format === "webp"
    ? `https://i.ytimg.com/vi_webp/${id}/${size}.webp`
    : `https://i.ytimg.com/vi/${id}/${size}.jpg`;
}
