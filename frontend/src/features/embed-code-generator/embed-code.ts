// Builds YouTube iframe embed code. Only options that differ from YouTube's
// defaults are written, so the code stays short and readable.

export type Aspect = "16 / 9" | "9 / 16" | "4 / 3";

export type EmbedOptions = {
  autoplay: boolean;
  mute: boolean;
  loop: boolean;
  controls: boolean;
  captions: boolean;
  fullscreen: boolean;
  keyboard: boolean;
  sameChannelRelated: boolean;
  privacy: boolean;
  lazy: boolean;
  start: number | null;
  end: number | null;
  size: { mode: "responsive"; aspect: Aspect } | { mode: "fixed"; width: number; height: number };
};

export const DEFAULT_OPTIONS: EmbedOptions = {
  autoplay: false,
  mute: false,
  loop: false,
  controls: true,
  captions: false,
  fullscreen: true,
  keyboard: true,
  sameChannelRelated: false,
  privacy: true,
  lazy: true,
  start: null,
  end: null,
  size: { mode: "responsive", aspect: "16 / 9" },
};

// YouTube's own default `allow` list.
const ALLOW = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

export function embedSrc(id: string, o: EmbedOptions) {
  const host = o.privacy ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
  const params = new URLSearchParams();
  if (o.autoplay) params.set("autoplay", "1");
  // Browsers block autoplay with sound, so autoplay implies mute.
  if (o.mute || o.autoplay) params.set("mute", "1");
  if (o.loop) {
    params.set("loop", "1");
    params.set("playlist", id); // loop only works on a playlist, even of one
  }
  if (!o.controls) params.set("controls", "0");
  if (o.captions) params.set("cc_load_policy", "1");
  if (!o.fullscreen) params.set("fs", "0");
  if (!o.keyboard) params.set("disablekb", "1");
  if (o.sameChannelRelated) params.set("rel", "0");
  if (o.start) params.set("start", String(o.start));
  if (o.end && (!o.start || o.end > o.start)) params.set("end", String(o.end));
  params.set("playsinline", "1"); // play in the page on iPhone, not fullscreen
  return `${host}/embed/${id}?${params}`;
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function embedHtml(id: string, title: string, o: EmbedOptions) {
  const lines = ["<iframe"];
  if (o.size.mode === "fixed") {
    lines.push(`  width="${o.size.width}"`, `  height="${o.size.height}"`, `  style="border: 0;"`);
  } else {
    lines.push(`  style="width: 100%; aspect-ratio: ${o.size.aspect}; border: 0;"`);
  }
  lines.push(
    `  src="${escapeHtml(embedSrc(id, o))}"`,
    `  title="${escapeHtml(title)}"`,
    `  allow="${ALLOW}"`,
    `  referrerpolicy="strict-origin-when-cross-origin"`,
  );
  if (o.lazy) lines.push(`  loading="lazy"`);
  if (o.fullscreen) lines.push("  allowfullscreen");
  lines.push("></iframe>");
  return lines.join("\n");
}

// A JSX string attribute can't contain `"`; fall back to an expression.
const jsxString = (text: string) => (/["{}]/.test(text) ? `{${JSON.stringify(text)}}` : `"${text}"`);

export function embedJsx(id: string, title: string, o: EmbedOptions) {
  const lines = ["<iframe"];
  if (o.size.mode === "fixed") {
    lines.push(`  width={${o.size.width}}`, `  height={${o.size.height}}`, `  style={{ border: 0 }}`);
  } else {
    lines.push(`  style={{ width: "100%", aspectRatio: "${o.size.aspect}", border: 0 }}`);
  }
  lines.push(
    `  src=${jsxString(embedSrc(id, o))}`,
    `  title=${jsxString(title)}`,
    `  allow="${ALLOW}"`,
    `  referrerPolicy="strict-origin-when-cross-origin"`,
  );
  if (o.lazy) lines.push(`  loading="lazy"`);
  if (o.fullscreen) lines.push("  allowFullScreen");
  lines.push("/>");
  return lines.join("\n");
}

// "1:02:03", "2:05", "125", "2m5s", "1h2m3s" -> seconds. null if empty/invalid.
export function parseTime(input: string): number | null {
  const text = input.trim().toLowerCase();
  if (!text) return null;
  if (/^\d+$/.test(text)) return Number(text);
  if (/^\d+(:\d{1,2}){1,2}$/.test(text)) {
    return text.split(":").reduce((total, part) => total * 60 + Number(part), 0);
  }
  const m = text.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
  if (m && (m[1] || m[2] || m[3])) return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
  return null;
}

export function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

// Start time from a pasted link (?t=90, ?t=1m30s, ?start=90), if any.
export function startFromUrl(input: string): number | null {
  try {
    const url = new URL(/^[a-z]+:\/\//i.test(input.trim()) ? input.trim() : `https://${input.trim()}`);
    const t = url.searchParams.get("t") ?? url.searchParams.get("start");
    return t ? parseTime(t) : null;
  } catch {
    return null;
  }
}

export const isShortsUrl = (input: string) => /youtube\.com\/shorts\//i.test(input);
