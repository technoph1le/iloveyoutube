import type { Check } from "@/components/ui/check-line";

// YouTube's limits for titles and descriptions.
export const MAX_TITLE = 100;
export const MAX_CHARS = 5000;
export const MAX_HASHTAGS = 15;
export const HASHTAGS_ABOVE_TITLE = 3;

export type Link = { id: string; label: string; url: string };

// The links and socials text last placed in the description, so edits to
// them can replace it in place.
export type Blocks = { links: string; socials: string };

export type Draft = {
  title: string;
  // The whole description, as it will be pasted into YouTube.
  body: string;
  links: Link[];
  socials: Record<string, string>;
  blocks: Blocks;
};

export const EMPTY_DRAFT: Draft = {
  title: "",
  body: "",
  links: [],
  socials: {},
  blocks: { links: "", socials: "" },
};

export type ChapterMode = "timed" | "estimated" | "short";

export type Generated = {
  title: string;
  description: string;
  chapters: { time: string; title: string }[];
  hashtags: string[];
  chapterMode: ChapterMode;
};

// A bare handle becomes a profile link where the address is predictable.
export const SOCIALS: { id: string; label: string; base: string | null; placeholder: string }[] = [
  { id: "instagram", label: "Instagram", base: "https://instagram.com/", placeholder: "@handle" },
  { id: "tiktok", label: "TikTok", base: "https://tiktok.com/@", placeholder: "@handle" },
  { id: "x", label: "X", base: "https://x.com/", placeholder: "@handle" },
  { id: "facebook", label: "Facebook", base: "https://facebook.com/", placeholder: "page name" },
  { id: "twitch", label: "Twitch", base: "https://twitch.tv/", placeholder: "channel" },
  { id: "patreon", label: "Patreon", base: "https://patreon.com/", placeholder: "name" },
  { id: "discord", label: "Discord", base: null, placeholder: "https://discord.gg/…" },
  { id: "website", label: "Website", base: null, placeholder: "example.com" },
];

export function socialUrl(value: string, base: string | null) {
  const text = value.trim();
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return text;
  if (base && !text.includes(".")) return base + text.replace(/^@/, "");
  return `https://${text.replace(/^\/+/, "")}`;
}

// A few emoji headings, as creators use them; the prose stays plain.
export function linksBlock(links: Link[]) {
  const lines = links
    .filter((l) => l.url.trim())
    .map((l) => (l.label.trim() ? `- ${l.label.trim()}: ${l.url.trim()}` : `- ${l.url.trim()}`));
  return lines.length ? ["🔗 Links:", ...lines].join("\n") : "";
}

export function socialsBlock(socials: Record<string, string>) {
  const lines = SOCIALS.map((s) => [s.label, socialUrl(socials[s.id] ?? "", s.base)] as const)
    .filter(([, url]) => url)
    .map(([label, url]) => `- ${label}: ${url}`);
  return lines.length ? ["📱 Follow me:", ...lines].join("\n") : "";
}

function chaptersBlock(chapters: Generated["chapters"]) {
  return chapters.length ? ["⏳ Timestamps", ...chapters.map((c) => `${c.time} – ${c.title}`)].join("\n") : "";
}

// Description, links, timestamps, socials, hashtags.
export function compose(result: Generated, links: Link[], socials: Record<string, string>) {
  const blocks = { links: linksBlock(links), socials: socialsBlock(socials) };
  const body = [
    result.description,
    blocks.links,
    chaptersBlock(result.chapters),
    blocks.socials,
    result.hashtags.map((t) => `#${t}`).join(" "),
  ]
    .filter(Boolean)
    .join("\n\n");
  return { body, blocks };
}

// Swaps an old block for its new version where it still appears unchanged.
function replaceBlock(body: string, oldBlock: string, newBlock: string) {
  if (!oldBlock || !body.includes(oldBlock)) return null;
  if (newBlock) return body.replace(oldBlock, newBlock);
  return body.replace(oldBlock, "").replace(/\n{3,}/g, "\n\n").trim();
}

// Keeps the description in step with edited links and socials.
export function syncBlocks(draft: Draft): Draft {
  let body = draft.body;
  const blocks = { ...draft.blocks };
  for (const [key, next] of [
    ["links", linksBlock(draft.links)],
    ["socials", socialsBlock(draft.socials)],
  ] as const) {
    if (next === blocks[key]) continue;
    const replaced = replaceBlock(body, blocks[key], next);
    if (replaced !== null) {
      body = replaced;
      blocks[key] = next;
    }
  }
  return { ...draft, body, blocks };
}

// Adds whichever of the links and socials blocks the description lacks, before
// the closing hashtags.
export function insertMissing(draft: Draft): Draft {
  const links = linksBlock(draft.links);
  const socials = socialsBlock(draft.socials);
  const missing = [links, socials].filter((b) => b && !draft.body.includes(b));
  if (!missing.length) return draft;
  const parts = draft.body.trim().split("\n\n");
  const last = parts[parts.length - 1] ?? "";
  const tail = /^#[\p{L}\p{N}_]/u.test(last) ? [parts.pop()!] : [];
  const body = [...parts, ...missing, ...tail].filter(Boolean).join("\n\n");
  return { ...draft, body, blocks: { links, socials } };
}

export function missingLinks(draft: Draft) {
  return [linksBlock(draft.links), socialsBlock(draft.socials)].some((b) => b && !draft.body.includes(b));
}

const CHAPTER_LINE = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s+\S/;

// YouTube only shows chapters when the timestamp lines follow its rules.
export function checkChapters(body: string): Check[] {
  const chapters = body
    .split("\n")
    .map((line) => line.trim())
    .map((line) => ({ line, m: line.match(CHAPTER_LINE) }))
    .filter((c) => c.m)
    .map(({ line, m }) => ({ line, seconds: Number(m![1] ?? 0) * 3600 + Number(m![2]) * 60 + Number(m![3]) }));
  if (!chapters.length) return [];

  const checks: Check[] = [];
  const times = chapters.map((c) => c.seconds);
  if (times[0] !== 0) checks.push({ level: "error", text: "The first chapter must start at 00:00." });
  if (times.length < 3) checks.push({ level: "error", text: `YouTube needs at least 3 chapters (there are ${times.length}).` });
  const order = times.findIndex((t, i) => i > 0 && t <= times[i - 1]);
  if (order > 0) {
    checks.push({ level: "error", text: `Chapters must be in time order: "${chapters[order].line}" is out of place.` });
  } else {
    const short = times.findIndex((t, i) => i > 0 && t - times[i - 1] < 10);
    if (short > 0) checks.push({ level: "error", text: `Chapters must be at least 10 seconds long: see "${chapters[short - 1].line}".` });
  }
  if (!checks.length) checks.push({ level: "ok", text: `${times.length} chapters, ready for YouTube` });
  return checks;
}

const HASHTAG = /(?:^|\s)#[\p{L}\p{N}_]+/gu;

export function checkAll(draft: Draft): Check[] {
  const checks: Check[] = [];
  const fmt = (n: number) => n.toLocaleString("en-US");
  const description = draft.body;

  if (draft.title.length > MAX_TITLE) {
    checks.push({ level: "error", text: `Title is ${draft.title.length} characters; YouTube allows ${MAX_TITLE}.` });
  }
  const length = description.length;
  checks.push(
    length > MAX_CHARS
      ? { level: "error", text: `Description: ${fmt(length)} / ${fmt(MAX_CHARS)} characters, ${fmt(length - MAX_CHARS)} over the limit` }
      : length > MAX_CHARS * 0.9
        ? { level: "warn", text: `Description: ${fmt(length)} / ${fmt(MAX_CHARS)} characters, close to the limit` }
        : { level: "ok", text: `Description: ${fmt(length)} / ${fmt(MAX_CHARS)} characters` },
  );
  if (/[<>]/.test(description) || /[<>]/.test(draft.title)) {
    checks.push({ level: "error", text: "YouTube doesn't allow < or > in titles and descriptions." });
  }

  const hashtags = description.match(HASHTAG) ?? [];
  if (hashtags.length > MAX_HASHTAGS) {
    checks.push({ level: "error", text: `${hashtags.length} hashtags: with more than ${MAX_HASHTAGS}, YouTube ignores all of them.` });
  } else if (hashtags.length) {
    checks.push({
      level: "ok",
      text: `${hashtags.length} of ${MAX_HASHTAGS} hashtags; the first ${Math.min(hashtags.length, HASHTAGS_ABOVE_TITLE)} show above your title`,
    });
  }

  const badLink = draft.links.find((l) => l.url.trim() && !isUrl(l.url.trim()));
  if (badLink) {
    checks.push({ level: "warn", text: `"${badLink.url.trim()}" doesn't look like a full link. Start it with https://` });
  }
  return [...checks, ...checkChapters(description)];
}

// The first hashtags in the description, which YouTube shows above the title
// when the title itself has none.
export function hashtagsAboveTitle(description: string, title: string) {
  if (/#[\p{L}\p{N}_]/u.test(title)) return [];
  return (description.match(HASHTAG) ?? []).map((t) => t.trim()).slice(0, HASHTAGS_ABOVE_TITLE);
}

function isUrl(text: string) {
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
