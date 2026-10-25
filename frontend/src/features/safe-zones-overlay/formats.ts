import type { Check } from "@/components/ui/check-line";

// Where YouTube's interface covers each format, in the format's own pixels.
// Banner sizes are YouTube's published ones; the rest are measured from the
// current desktop site and mobile app and can shift a little between devices.

export type Rect = { x: number; y: number; w: number; h: number };

export type Zone = {
  id: string;
  label: string;
  rect: Rect;
  // "ui" is covered by interface, "crop" is cut off on some screens, and
  // "badge" is drawn as the real duration badge.
  kind: "ui" | "crop" | "badge";
  text?: string;
  fontPx?: number;
  live?: boolean;
};

export type Guide = { id: string; label: string; rect: Rect; tone: "safe" | "info" };

export type Layout = { width: number; height: number; zones: Zone[]; guides: Guide[] };

export type FormatId = "thumbnail" | "shorts" | "video" | "banner";
export type ThumbnailContext = "home" | "up-next";
export type BadgeType = "short" | "long" | "live";
export type Options = { context: ThumbnailContext; badge: BadgeType };

type Spec = {
  ratio: number;
  recommended: [number, number];
  min?: [number, number];
  maxBytes?: number;
};

export const FORMATS: {
  id: FormatId;
  label: string;
  note: string;
  spec: Spec;
}[] = [
  {
    id: "thumbnail",
    label: "Thumbnail",
    note: "The duration badge covers the bottom-right corner of every thumbnail, and it's relatively much larger in small spots like Up next. Keep text and faces out of that corner.",
    spec: { ratio: 16 / 9, recommended: [1280, 720], min: [640, 360], maxBytes: 2 * 1024 * 1024 },
  },
  {
    id: "shorts",
    label: "Shorts",
    note: "The action buttons, channel name, title and caption sit on top of your Short. Keep text and faces inside the green area. Positions shift slightly between phones and app versions.",
    spec: { ratio: 9 / 16, recommended: [1080, 1920] },
  },
  {
    id: "video",
    label: "Video player",
    note: "Controls and the title bar appear when viewers pause or hover, and captions sit just above the controls. Keep on-screen text inside the green area.",
    spec: { ratio: 16 / 9, recommended: [1920, 1080] },
  },
  {
    id: "banner",
    label: "Channel banner",
    note: "TVs show the whole image, desktops a 2560×423 strip, and phones only the center 1546×423. Put text and logos in the green area.",
    spec: { ratio: 16 / 9, recommended: [2560, 1440], min: [2048, 1152], maxBytes: 6 * 1024 * 1024 },
  },
];

// Thumbnail card widths in CSS pixels, and the badge inset at that size.
const CONTEXTS: Record<ThumbnailContext, { label: string; width: number; inset: number }> = {
  home: { label: "Home & search", width: 360, inset: 8 },
  "up-next": { label: "Up next", width: 168, inset: 4 },
};

export const CONTEXT_OPTIONS = (Object.keys(CONTEXTS) as ThumbnailContext[]).map((id) => ({
  id,
  label: CONTEXTS[id].label,
  width: CONTEXTS[id].width,
}));

export const BADGE_OPTIONS: { id: BadgeType; label: string }[] = [
  { id: "short", label: "12:34" },
  { id: "long", label: "1:23:45" },
  { id: "live", label: "LIVE" },
];

const BADGE_TEXT: Record<BadgeType, string> = { short: "12:34", long: "1:23:45", live: "LIVE" };

// Width of the badge text in YouTube's 12px medium Roboto.
function badgeTextWidth(text: string) {
  let width = 0;
  for (const char of text) width += char === ":" ? 3.5 : /\d/.test(char) ? 7 : 8;
  return width;
}

function thumbnailLayout({ context, badge }: Options): Layout {
  const { width: cardW, inset } = CONTEXTS[context];
  const cardH = (cardW * 9) / 16;
  const s = 1280 / cardW;
  const r = (x: number, y: number, w: number, h: number) => ({ x: x * s, y: y * s, w: w * s, h: h * s });

  const text = BADGE_TEXT[badge];
  const badgeW = badgeTextWidth(text) + 8 + (badge === "live" ? 14 : 0);
  const badgeH = 18;
  const button = 28;

  return {
    width: 1280,
    height: 720,
    zones: [
      {
        id: "badge",
        label: badge === "live" ? "Live badge" : "Duration badge",
        rect: r(cardW - inset - badgeW, cardH - inset - badgeH, badgeW, badgeH),
        kind: "badge",
        text,
        fontPx: 12 * s,
        live: badge === "live",
      },
      { id: "progress", label: "Watch progress bar", rect: r(0, cardH - 4, cardW, 4), kind: "ui" },
      {
        id: "hover",
        label: "Watch later & queue (on hover)",
        rect: r(cardW - 4 - button, 4, button, button * 2 + 4),
        kind: "ui",
      },
    ],
    guides: [],
  };
}

const LAYOUTS: Record<Exclude<FormatId, "thumbnail">, Layout> = {
  shorts: {
    width: 1080,
    height: 1920,
    zones: [
      { id: "top", label: "Search & menu", rect: { x: 0, y: 0, w: 1080, h: 140 }, kind: "ui" },
      { id: "actions", label: "Like, comment, share", rect: { x: 930, y: 880, w: 150, h: 820 }, kind: "ui" },
      {
        id: "info",
        label: "Channel, title & sound",
        rect: { x: 0, y: 1420, w: 900, h: 400 },
        kind: "ui",
      },
      { id: "progress", label: "Progress bar", rect: { x: 0, y: 1880, w: 1080, h: 40 }, kind: "ui" },
    ],
    guides: [{ id: "safe", label: "Safe area", rect: { x: 60, y: 160, w: 840, h: 1240 }, tone: "safe" }],
  },
  video: {
    width: 1920,
    height: 1080,
    zones: [
      { id: "title", label: "Title bar (embeds & fullscreen)", rect: { x: 0, y: 0, w: 1500, h: 120 }, kind: "ui" },
      { id: "top-right", label: "Cards & share", rect: { x: 1620, y: 20, w: 280, h: 100 }, kind: "ui" },
      { id: "captions", label: "Captions", rect: { x: 360, y: 820, w: 1200, h: 130 }, kind: "ui" },
      { id: "watermark", label: "Watermark", rect: { x: 1720, y: 820, w: 150, h: 120 }, kind: "ui" },
      { id: "controls", label: "Player controls", rect: { x: 0, y: 960, w: 1920, h: 120 }, kind: "ui" },
    ],
    guides: [{ id: "safe", label: "Safe area", rect: { x: 96, y: 140, w: 1728, h: 670 }, tone: "safe" }],
  },
  banner: {
    width: 2560,
    height: 1440,
    zones: [
      { id: "tv-top", label: "Only on TV", rect: { x: 0, y: 0, w: 2560, h: 508 }, kind: "crop" },
      { id: "tv-bottom", label: "Only on TV", rect: { x: 0, y: 932, w: 2560, h: 508 }, kind: "crop" },
    ],
    guides: [
      { id: "desktop", label: "Desktop", rect: { x: 0, y: 508, w: 2560, h: 424 }, tone: "info" },
      { id: "tablet", label: "Tablet", rect: { x: 352, y: 508, w: 1856, h: 424 }, tone: "info" },
      { id: "safe", label: "All devices", rect: { x: 507, y: 508, w: 1546, h: 424 }, tone: "safe" },
    ],
  },
};

export function getLayout(format: FormatId, options: Options): Layout {
  return format === "thumbnail" ? thumbnailLayout(options) : LAYOUTS[format];
}

export function thumbnailCardWidth(context: ThumbnailContext) {
  return CONTEXTS[context].width;
}

export function checkImage(format: FormatId, image: { width: number; height: number; bytes: number }): Check[] {
  const { spec } = FORMATS.find((f) => f.id === format)!;
  const { width, height, bytes } = image;
  const [recW, recH] = spec.recommended;
  const ratioName = spec.ratio > 1 ? "16:9" : "9:16";
  const checks: Check[] = [];

  checks.push(
    Math.abs(width / height - spec.ratio) < 0.02
      ? { level: "ok", text: ratioName }
      : { level: "warn", text: `Not ${ratioName} (${width}×${height}), so YouTube will crop it` },
  );
  if (spec.min && (width < spec.min[0] || height < spec.min[1])) {
    checks.push({ level: "error", text: `${width}×${height}: under the ${spec.min[0]}×${spec.min[1]} minimum` });
  } else if (width < recW || height < recH) {
    checks.push({ level: "warn", text: `${width}×${height}: ${recW}×${recH} recommended` });
  } else {
    checks.push({ level: "ok", text: `${width}×${height}` });
  }
  if (spec.maxBytes) {
    const mb = bytes / 1024 / 1024;
    const limit = spec.maxBytes / 1024 / 1024;
    checks.push(
      bytes <= spec.maxBytes
        ? { level: "ok", text: `${mb.toFixed(2)} MB` }
        : { level: "error", text: `${mb.toFixed(1)} MB: over YouTube's ${limit} MB limit` },
    );
  }
  return checks;
}
