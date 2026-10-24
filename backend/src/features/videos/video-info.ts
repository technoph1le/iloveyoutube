// Everything the thumbnail downloader needs about a video: title and channel
// (YouTube oEmbed, no API key or quota) and which thumbnail sizes exist (HEAD
// requests to YouTube's image CDN). Done server-side because browsers can't
// call oEmbed, and privacy extensions often block cross-site fetches.

export const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
export const SIZES = ["maxresdefault", "sddefault", "hqdefault", "mqdefault", "default"] as const;
export const FORMATS = ["jpg", "webp"] as const;

export type Size = (typeof SIZES)[number];
export type Format = (typeof FORMATS)[number];

export type VideoInfo = {
  id: string;
  title: string | null;
  author: string | null;
  authorUrl: string | null;
  // Bytes per size and format; null when YouTube didn't generate that size.
  sizes: Record<Format, Record<Size, number | null>>;
};

export function thumbnailUrl(id: string, size: Size, format: Format) {
  return format === "webp"
    ? `https://i.ytimg.com/vi_webp/${id}/${size}.webp`
    : `https://i.ytimg.com/vi/${id}/${size}.jpg`;
}

const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 1000;
// null = the video doesn't exist or isn't public.
const cache = new Map<string, { at: number; info: VideoInfo | null }>();

async function getOembed(id: string) {
  const url = new URL("https://www.youtube.com/oembed");
  url.searchParams.set("url", `https://www.youtube.com/watch?v=${id}`);
  url.searchParams.set("format", "json");
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (res.ok) {
    const data = (await res.json()) as { title: string; author_name: string; author_url: string };
    return { title: data.title, author: data.author_name, authorUrl: data.author_url };
  }
  // 401/403: exists but can't be embedded or isn't public; 400/404: no video.
  if ([400, 401, 403, 404].includes(res.status)) return null;
  throw new Error(`oEmbed ${res.status}`);
}

async function getSize(id: string, size: Size, format: Format) {
  const res = await fetch(thumbnailUrl(id, size, format), {
    method: "HEAD",
    signal: AbortSignal.timeout(5000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Thumbnail HEAD ${res.status}`);
  return Number(res.headers.get("content-length")) || 0;
}

export async function getVideoInfo(id: string): Promise<VideoInfo | null> {
  const hit = cache.get(id);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.info;

  const [oembed, ...bytes] = await Promise.all([
    getOembed(id),
    ...FORMATS.flatMap((format) => SIZES.map((size) => getSize(id, size, format))),
  ]);
  const sizes = Object.fromEntries(
    FORMATS.map((format, f) => [
      format,
      Object.fromEntries(SIZES.map((size, s) => [size, bytes[f * SIZES.length + s]])),
    ]),
  ) as VideoInfo["sizes"];

  const hasThumbnails = Object.values(sizes.jpg).some((b) => b !== null);
  const info: VideoInfo | null =
    oembed || hasThumbnails
      ? {
          id,
          title: oembed?.title ?? null,
          author: oembed?.author ?? null,
          authorUrl: oembed?.authorUrl ?? null,
          sizes,
        }
      : null;

  if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value!);
  cache.set(id, { at: Date.now(), info });
  return info;
}
