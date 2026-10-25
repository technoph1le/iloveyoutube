// Turns a pasted transcript into timed lines. Accepts what creators can copy:
// YouTube Studio's transcript panel (a timestamp line, then text), "[1:23] text"
// or "1:23 text" lines, and SRT/VTT caption files.

export type Line = { seconds: number; text: string };

const TIME = /(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:[.,]\d{1,3})?/;
const TIME_ONLY = new RegExp(`^\\[?${TIME.source}\\]?$`);
const TIME_THEN_TEXT = new RegExp(`^\\[?${TIME.source}\\]?\\s*[-–:]?\\s+(.+)$`);
const CUE = new RegExp(`^${TIME.source}\\s*-->`);

function toSeconds(match: RegExpMatchArray) {
  const [, h = "0", m, s] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

export function parseTranscript(input: string): Line[] {
  const lines: Line[] = [];
  let pending: number | null = null;

  for (const raw of input.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    if (!line || line === "WEBVTT" || /^\d+$/.test(line)) continue;

    const cue = line.match(CUE);
    if (cue) {
      pending = toSeconds(cue);
      continue;
    }
    const timeOnly = line.match(TIME_ONLY);
    if (timeOnly) {
      pending = toSeconds(timeOnly);
      continue;
    }
    const inline = line.match(TIME_THEN_TEXT);
    if (inline) {
      lines.push({ seconds: toSeconds(inline), text: inline[4].replace(/<[^>]+>/g, "") });
      pending = null;
      continue;
    }
    const text = line.replace(/<[^>]+>/g, "");
    if (pending !== null) {
      lines.push({ seconds: pending, text });
      pending = null;
    } else if (lines.length) {
      // Wrapped caption text continues the previous line.
      lines[lines.length - 1].text += ` ${text}`;
    }
  }
  return lines;
}

// Typical speaking pace, for estimating times in a transcript without them.
const WORDS_PER_MINUTE = 150;

// Splits plain text into blocks of about 25 words, each with an estimated time
// based on how far into the transcript it starts.
export function estimateTimes(text: string): Line[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: Line[] = [];
  for (let i = 0; i < words.length; i += 25) {
    lines.push({ seconds: Math.round((i / WORDS_PER_MINUTE) * 60), text: words.slice(i, i + 25).join(" ") });
  }
  return lines;
}

export function estimatedDuration(text: string) {
  return Math.round((text.split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE) * 60);
}

export function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${String(m).padStart(2, "0")}:${s}`;
}

// Merges consecutive lines into blocks of at least `step` seconds, so long
// transcripts stay small while keeping real timestamps to choose from.
export function condense(lines: Line[], step: number): Line[] {
  const out: Line[] = [];
  for (const line of lines) {
    const last = out[out.length - 1];
    if (last && line.seconds - last.seconds < step) last.text += ` ${line.text}`;
    else out.push({ ...line });
  }
  return out;
}

export type Chapter = { seconds: number; title: string };

// Applies YouTube's chapter rules: the first starts at 0:00, chapters are in
// order and at least 10 seconds apart (or `minGap`, if longer).
export function cleanChapters(chapters: Chapter[], duration: number, minGap = 10): Chapter[] {
  const sorted = [...chapters]
    .filter((c) => Number.isFinite(c.seconds) && c.seconds >= 0 && c.seconds <= duration && c.title.trim())
    .sort((a, b) => a.seconds - b.seconds);
  const out: Chapter[] = [];
  for (const chapter of sorted) {
    // YouTube rejects descriptions containing < or >.
    const title = chapter.title.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim().slice(0, 100);
    if (!out.length) out.push({ seconds: 0, title });
    else if (chapter.seconds - out[out.length - 1].seconds >= Math.max(10, minGap)) out.push({ seconds: chapter.seconds, title });
  }
  return out;
}
