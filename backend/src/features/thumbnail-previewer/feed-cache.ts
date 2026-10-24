import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "../../env.js";
import { fetchFeed, type Feed } from "./trending.js";

// The trending feed is fetched from YouTube at most once a week. It's kept in
// memory and on disk so restarts don't refetch; Railway's disk resets on
// deploy, which just costs one extra refresh.
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const CACHE_FILE = path.resolve(".cache", "youtube-feed.json");

let feed: Feed | null = null;
let refreshing: Promise<Feed> | null = null;
let loadedFromDisk = false;

const isFresh = (f: Feed) =>
  Date.now() - new Date(f.fetchedAt).getTime() < MAX_AGE_MS && f.region === env.YOUTUBE_REGION;

async function loadFromDisk() {
  if (loadedFromDisk) return;
  loadedFromDisk = true;
  try {
    feed = JSON.parse(await readFile(CACHE_FILE, "utf8")) as Feed;
  } catch {
    // No cache yet.
  }
}

function refresh() {
  if (!env.YOUTUBE_API_KEY) {
    return Promise.reject(new Error("YOUTUBE_API_KEY is not set"));
  }
  // One refresh at a time, however many requests arrive meanwhile.
  refreshing ??= fetchFeed(env.YOUTUBE_API_KEY, env.YOUTUBE_REGION)
    .then(async (fresh) => {
      feed = fresh;
      await mkdir(path.dirname(CACHE_FILE), { recursive: true });
      await writeFile(CACHE_FILE, JSON.stringify(fresh));
      console.log(`YouTube feed refreshed: ${fresh.videos.length} videos`);
      return fresh;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

// Returns the cached feed, refreshing it when it's older than a week. A stale
// feed is served immediately while the refresh runs, and kept if it fails.
export async function getFeed(): Promise<Feed> {
  await loadFromDisk();
  if (feed && isFresh(feed)) return feed;
  if (feed) {
    refresh().catch((err) => console.error("YouTube feed refresh failed:", err));
    return feed;
  }
  return refresh();
}
