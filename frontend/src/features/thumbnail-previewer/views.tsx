/* eslint-disable @next/next/no-img-element -- YouTube images (via our image proxy) and local
   blob: URLs; next/image's optimizer adds nothing for either. */
import type { CSSProperties, ReactNode } from "react";
import { Bell, Menu, Mic, Play, Search, Tv, Upload } from "lucide-react";
import { proxiedImage } from "@/utils/images";
import {
  formatAge,
  formatDuration,
  formatViews,
  type Card,
  type Mine,
} from "@/features/thumbnail-previewer/feed";

export type ViewId = "home" | "search" | "up-next" | "mobile" | "tv";

export const VIEWS: { id: ViewId; label: string; cards: number; slotRange: number }[] = [
  { id: "home", label: "Home", cards: 16, slotRange: 8 },
  { id: "search", label: "Search", cards: 8, slotRange: 4 },
  { id: "up-next", label: "Up next", cards: 12, slotRange: 6 },
  { id: "mobile", label: "Mobile", cards: 8, slotRange: 4 },
  { id: "tv", label: "TV", cards: 10, slotRange: 4 },
];

export type YtTheme = "dark" | "light";

const THEMES: Record<YtTheme, Record<string, string>> = {
  dark: {
    "--yt-bg": "#0f0f0f",
    "--yt-text": "#f1f1f1",
    "--yt-text-2": "#aaaaaa",
    "--yt-chip": "#272727",
    "--yt-chip-active": "#f1f1f1",
    "--yt-chip-active-text": "#0f0f0f",
    "--yt-skeleton": "#272727",
    "--yt-border": "#303030",
  },
  light: {
    "--yt-bg": "#ffffff",
    "--yt-text": "#0f0f0f",
    "--yt-text-2": "#606060",
    "--yt-chip": "#f2f2f2",
    "--yt-chip-active": "#0f0f0f",
    "--yt-chip-active-text": "#ffffff",
    "--yt-skeleton": "#e5e5e5",
    "--yt-border": "#d3d3d3",
  },
};

export type ViewProps = {
  cards: Card[];
  mine: Mine;
  fetchedAt: string;
  highlight: boolean;
};

type CardData = {
  thumbnail: string | null;
  title: string;
  channel: string;
  avatar: string | null;
  views: string;
  age: string;
  badge: string;
  live: boolean;
};

function resolve(card: Card, mine: Mine, fetchedAt: string): CardData | null {
  if (card.kind === "placeholder") return null;
  if (card.kind === "mine") {
    return {
      thumbnail: mine.thumbnail,
      title: mine.title || "Your video title",
      channel: mine.channel || "Your channel",
      avatar: mine.avatar,
      views: formatViews(mine.views),
      age: "1 day ago",
      badge: mine.duration,
      live: false,
    };
  }
  const v = card.video;
  return {
    thumbnail: proxiedImage(v.thumbnail),
    title: v.title,
    channel: v.channelTitle,
    avatar: proxiedImage(v.channelAvatar),
    views: formatViews(v.viewCount),
    age: formatAge(v.publishedAt, fetchedAt),
    badge: formatDuration(v.durationSeconds),
    live: v.isLive,
  };
}

// Theme + font wrapper shared by every view.
export function YtFrame({ theme, children }: { theme: YtTheme; children: ReactNode }) {
  return (
    <div
      style={{ ...THEMES[theme], fontFamily: "Roboto, Arial, sans-serif" } as CSSProperties}
      className="bg-(--yt-bg) text-(--yt-text)"
    >
      {children}
    </div>
  );
}

function Thumb({
  data,
  className = "rounded-xl",
  badgeClass = "text-xs",
}: {
  data: CardData | null;
  className?: string;
  badgeClass?: string;
}) {
  return (
    <div className={`relative aspect-video overflow-hidden bg-(--yt-skeleton) ${className}`}>
      {data?.thumbnail ? (
        <img src={data.thumbnail} alt="" loading="lazy" className="size-full object-cover" />
      ) : data ? (
        <div className="flex size-full flex-col items-center justify-center gap-1 border-2 border-dashed border-(--yt-text-2) text-sm text-(--yt-text-2)">
          <Upload className="size-5" />
          Your thumbnail
        </div>
      ) : null}
      {data && (data.live || data.badge) && (
        <span
          className={`absolute right-1.5 bottom-1.5 rounded px-1 py-px font-medium text-white ${badgeClass} ${
            data.live ? "bg-[#cc0000]" : "bg-black/80"
          }`}
        >
          {data.live ? "LIVE" : data.badge}
        </span>
      )}
    </div>
  );
}

function Avatar({ data, size }: { data: CardData; size: string }) {
  return data.avatar ? (
    <img src={data.avatar} alt="" loading="lazy" className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <span
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-[#5c6bc0] text-sm font-medium text-white uppercase`}
    >
      {data.channel[0]}
    </span>
  );
}

function Lines({ count, widths = ["w-full", "w-2/3", "w-1/3"] }: { count: number; widths?: string[] }) {
  return (
    <div className="flex flex-1 flex-col gap-2 pt-1">
      {widths.slice(0, count).map((w) => (
        <span key={w} className={`h-3 rounded bg-(--yt-skeleton) ${w}`} />
      ))}
    </div>
  );
}

function Highlight({ on, children, className = "" }: { on: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={`${className} ${on ? "rounded-xl ring-2 ring-[#3ea6ff] ring-offset-4 ring-offset-(--yt-bg)" : ""}`}>
      {children}
    </div>
  );
}

function TopBar({ query }: { query?: string }) {
  return (
    <div className="flex h-14 items-center justify-between gap-4 px-4">
      <div className="flex items-center gap-4">
        <Menu className="size-6" />
        <span className="flex items-center gap-1 text-lg font-semibold tracking-tight">
          <span className="flex h-5 w-7 items-center justify-center rounded-md bg-[#ff0000]">
            <Play className="size-3 fill-white text-white" />
          </span>
          YouTube
        </span>
      </div>
      <div className="hidden max-w-xl flex-1 items-center gap-3 md:flex">
        <div className="flex h-10 flex-1 items-center rounded-full border border-(--yt-border)">
          <span className="flex-1 truncate px-4 text-(--yt-text-2)">{query || "Search"}</span>
          <span className="flex h-full w-16 items-center justify-center rounded-r-full border-l border-(--yt-border) bg-(--yt-chip)">
            <Search className="size-5" />
          </span>
        </div>
        <span className="flex size-10 items-center justify-center rounded-full bg-(--yt-chip)">
          <Mic className="size-5" />
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="size-6" />
        <span className="size-8 rounded-full bg-[#7e57c2]" />
      </div>
    </div>
  );
}

export function HomeView({
  cards,
  mine,
  fetchedAt,
  highlight,
  chips,
}: ViewProps & { chips: ReactNode }) {
  return (
    <>
      <TopBar />
      <div className="px-4 pt-2 pb-8 sm:px-6">
        {chips}
        <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => {
            const data = resolve(card, mine, fetchedAt);
            return (
              <Highlight key={card.key} on={highlight && card.kind === "mine"}>
                <Thumb data={data} />
                <div className="mt-3 flex gap-3">
                  {data ? (
                    <>
                      <Avatar data={data} size="size-9" />
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-base leading-[22px] font-medium">{data.title}</h3>
                        <p className="mt-1 text-sm text-(--yt-text-2)">{data.channel}</p>
                        <p className="text-sm text-(--yt-text-2)">
                          {data.views} • {data.age}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="size-9 shrink-0 rounded-full bg-(--yt-skeleton)" />
                      <Lines count={3} />
                    </>
                  )}
                </div>
              </Highlight>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function SearchView({ cards, mine, fetchedAt, highlight }: ViewProps) {
  return (
    <>
      <TopBar query={mine.title} />
      <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-4 py-6">
        {cards.map((card) => {
          const data = resolve(card, mine, fetchedAt);
          return (
            <Highlight key={card.key} on={highlight && card.kind === "mine"} className="flex flex-col gap-4 sm:flex-row">
              <Thumb data={data} className="w-full shrink-0 rounded-xl sm:w-[360px]" />
              {data ? (
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-lg leading-[26px]">{data.title}</h3>
                  <p className="text-xs text-(--yt-text-2)">
                    {data.views} • {data.age}
                  </p>
                  <div className="my-3 flex items-center gap-2 text-xs text-(--yt-text-2)">
                    <Avatar data={data} size="size-6" />
                    {data.channel}
                  </div>
                </div>
              ) : (
                <Lines count={3} />
              )}
            </Highlight>
          );
        })}
      </div>
    </>
  );
}

export function UpNextView({ cards, mine, fetchedAt, highlight }: ViewProps) {
  return (
    <>
      <TopBar />
      <div className="grid gap-6 px-4 py-6 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="flex aspect-video items-center justify-center rounded-xl bg-black">
            <Play className="size-14 fill-white/80 text-white/80" />
          </div>
          <Lines count={2} widths={["w-3/4", "w-1/3"]} />
        </div>
        <div className="flex flex-col gap-2">
          {cards.map((card) => {
            const data = resolve(card, mine, fetchedAt);
            return (
              <Highlight key={card.key} on={highlight && card.kind === "mine"} className="flex gap-2">
                <Thumb data={data} className="w-[168px] shrink-0 rounded-lg" badgeClass="text-[11px]" />
                {data ? (
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-sm leading-5 font-medium">{data.title}</h3>
                    <p className="mt-1 text-xs text-(--yt-text-2)">{data.channel}</p>
                    <p className="text-xs text-(--yt-text-2)">
                      {data.views} • {data.age}
                    </p>
                  </div>
                ) : (
                  <Lines count={3} />
                )}
              </Highlight>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function MobileView({ cards, mine, fetchedAt, highlight }: ViewProps) {
  return (
    <div className="flex justify-center px-4 py-8">
      <div className="h-[760px] w-full max-w-[390px] overflow-y-auto rounded-[2.5rem] border-[10px] border-[#1f1f1f] bg-(--yt-bg)">
        <div className="sticky top-0 z-10 flex h-12 items-center justify-between bg-(--yt-bg) px-3">
          <span className="flex items-center gap-1 font-semibold tracking-tight">
            <span className="flex h-4 w-6 items-center justify-center rounded bg-[#ff0000]">
              <Play className="size-2.5 fill-white text-white" />
            </span>
            YouTube
          </span>
          <span className="flex items-center gap-4">
            <Tv className="size-5" />
            <Bell className="size-5" />
            <Search className="size-5" />
          </span>
        </div>
        {cards.map((card) => {
          const data = resolve(card, mine, fetchedAt);
          return (
            <Highlight key={card.key} on={highlight && card.kind === "mine"} className="mb-5">
              <Thumb data={data} className="" />
              <div className="flex gap-3 px-3 pt-3">
                {data ? (
                  <>
                    <Avatar data={data} size="size-9" />
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-[15px] leading-5 font-medium">{data.title}</h3>
                      <p className="mt-0.5 text-xs text-(--yt-text-2)">
                        {data.channel} · {data.views} · {data.age}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="size-9 shrink-0 rounded-full bg-(--yt-skeleton)" />
                    <Lines count={2} />
                  </>
                )}
              </div>
            </Highlight>
          );
        })}
      </div>
    </div>
  );
}

// The TV app is always dark and shows big cards in horizontal shelves.
export function TvView({ cards, mine, fetchedAt, highlight }: ViewProps) {
  const shelves = [cards.slice(0, 5), cards.slice(5, 10)];
  return (
    <div className="overflow-hidden bg-[#0f0f0f] px-8 py-10 text-[#f1f1f1]">
      {shelves.map((shelf, i) => (
        <section key={i} className={i ? "mt-10" : ""}>
          <h2 className="mb-4 text-2xl font-medium">{i ? "Trending" : "Recommended"}</h2>
          <div className="flex gap-6">
            {shelf.map((card) => {
              const data = resolve(card, mine, fetchedAt);
              return (
                <Highlight key={card.key} on={highlight && card.kind === "mine"} className="w-[30%] shrink-0">
                  <Thumb data={data} className="rounded-2xl" badgeClass="text-sm" />
                  {data ? (
                    <div className="mt-3">
                      <h3 className="line-clamp-2 text-xl leading-7 font-medium">{data.title}</h3>
                      <p className="mt-1 text-base text-[#aaaaaa]">
                        {data.channel} • {data.views}
                      </p>
                    </div>
                  ) : (
                    <Lines count={2} />
                  )}
                </Highlight>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
