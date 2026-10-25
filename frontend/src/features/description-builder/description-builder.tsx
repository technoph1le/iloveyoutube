"use client";

import { useEffect, useRef, useState, type DragEvent, type ReactNode } from "react";
import { Check, Copy, Link2, LoaderCircle, Plus, RotateCcw, Sparkles, Trash2, Undo2 } from "lucide-react";
import { CheckLine } from "@/components/ui/check-line";
import {
  EMPTY_DRAFT,
  MAX_TITLE,
  SOCIALS,
  checkAll,
  compose,
  hashtagsAboveTitle,
  insertMissing,
  missingLinks,
  syncBlocks,
  type Draft,
  type Generated,
} from "./builder";

const DRAFT_STORAGE = "iloveyoutube:description-draft";
const API = "/api/description-builder";
const MAX_TRANSCRIPT = 150_000;

type AiStatus = "loading" | "on" | "off";
type Result = Pick<Draft, "title" | "body" | "blocks">;
type Notice = { tone: "warn" | "info"; text: string };

const CHAPTER_NOTICES: Record<Generated["chapterMode"], Notice | null> = {
  timed: null,
  estimated: {
    tone: "warn",
    text: "Your transcript has no timestamps, so the chapter times are estimates. Adjust them to match your video.",
  },
  short: { tone: "info", text: "Your video is under 2 minutes, so it doesn't need chapters." },
};

export function DescriptionBuilder() {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [transcript, setTranscript] = useState("");
  const [dragging, setDragging] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatus>("loading");
  const [hourlyLimit, setHourlyLimit] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [undo, setUndo] = useState<Result | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const loaded = useRef(false);

  // Restore the saved draft, and ask whether AI is available.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE);
      if (saved) {
        const { title, body, links, socials, blocks } = { ...EMPTY_DRAFT, ...(JSON.parse(saved) as Partial<Draft>) };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only state after hydration
        setDraft({ title, body, links, socials, blocks: { ...EMPTY_DRAFT.blocks, ...blocks } });
      }
    } catch {
      // Storage blocked or unreadable; start empty.
    }
    loaded.current = true;
    fetch(`${API}/status`)
      .then((res) => (res.ok ? (res.json() as Promise<{ ai: boolean; hourlyLimit: number }>) : null))
      .then((status) => {
        setAiStatus(status?.ai ? "on" : "off");
        setHourlyLimit(status?.hourlyLimit ?? null);
      })
      .catch(() => setAiStatus("off"));
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(DRAFT_STORAGE, JSON.stringify(draft));
    } catch {
      // Storage blocked; the draft just isn't kept.
    }
  }, [draft]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => {
      const next = { ...d, [key]: value };
      return key === "links" || key === "socials" ? syncBlocks(next) : next;
    });
  }

  async function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    const text = file ? (file.size <= MAX_TRANSCRIPT * 4 ? await file.text() : null) : event.dataTransfer.getData("text");
    if (text === null) setError("That file is too large for a transcript.");
    else if (text) setTranscript(text);
  }

  async function generate() {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`${API}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = (await res.json().catch(() => null)) as (Generated & { error?: string }) | null;
      if (!res.ok || !data) throw new Error(data?.error ?? "Something went wrong. Please try again.");

      setUndo(draft.title || draft.body ? { title: draft.title, body: draft.body, blocks: draft.blocks } : null);
      setDraft((d) => ({ ...d, title: data.title, ...compose(data, d.links, d.socials) }));
      setNotice(CHAPTER_NOTICES[data.chapterMode]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function restore() {
    if (!undo) return;
    setDraft((d) => ({ ...d, ...undo }));
    setUndo(null);
  }

  function reset() {
    setDraft((d) => ({ ...EMPTY_DRAFT, links: d.links, socials: d.socials }));
    setTranscript("");
    setUndo(null);
    setError(null);
    setNotice(null);
  }

  async function copy(what: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(null), 2000);
  }

  const aboveTitle = hashtagsAboveTitle(draft.body, draft.title);
  const checks = checkAll(draft);
  const tooShort = transcript.trim().length < 200;

  return (
    // The result spans both rows; the second row absorbs its extra height so
    // the transcript and links cards stay together.
    <div className="mx-auto grid w-full max-w-7xl items-start gap-6 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-8">
      {/* 1. Transcript */}
      <section aria-labelledby="transcript-title" className={`${cardClass} lg:col-start-1 lg:row-start-1`}>
        <Heading id="transcript-title" step={1} title="Your transcript">
          Drop or paste your video&apos;s transcript, then let AI write your title, description, chapters and hashtags.
        </Heading>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => void onDrop(e)}
          className={`rounded-xl border-2 border-dashed transition-colors ${dragging ? "border-brand bg-muted" : "border-border"}`}
        >
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={12}
            spellCheck={false}
            aria-label="Transcript"
            placeholder={"Drop your transcript here, or paste it.\n\n0:00\nHey everyone, welcome back…\n0:12\nToday we're building…"}
            className="block w-full resize-y rounded-xl bg-transparent px-4 py-3 font-mono text-sm leading-relaxed outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <details>
            <summary className="cursor-pointer font-medium text-foreground">Where do I find my transcript?</summary>
            <p className="mt-2">
              On your video&apos;s page, open &ldquo;…more&rdquo; below the video, then &ldquo;Show transcript&rdquo;, and
              copy it. With timestamps, chapter times are exact; without them, they&apos;re estimated.
            </p>
          </details>
          <span className={`self-start ${transcript.length > MAX_TRANSCRIPT ? "text-brand" : ""}`}>
            {transcript.length.toLocaleString("en-US")} / {MAX_TRANSCRIPT.toLocaleString("en-US")}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void generate()}
              disabled={aiStatus !== "on" || busy || tooShort || transcript.length > MAX_TRANSCRIPT}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-strong px-6 font-semibold text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? <LoaderCircle className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
              {busy ? "Writing…" : "Generate with AI"}
            </button>
            {undo && !busy && (
              <button
                type="button"
                onClick={restore}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Undo2 className="size-4" />
                Bring back the previous version
              </button>
            )}
          </div>
          {error ? (
            <p role="alert" className="text-sm text-brand">
              {error}
            </p>
          ) : notice ? (
            <p role="status" className={`text-sm ${notice.tone === "warn" ? "text-amber-500" : "text-muted-foreground"}`}>
              {notice.text}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {aiStatus === "off"
                ? "AI isn't available right now. You can still write your title and description on the right."
                : tooShort && transcript.trim()
                  ? "Paste the full transcript; this is too short to work from."
                  : `Takes a few seconds.${hourlyLimit ? ` Up to ${hourlyLimit} generations an hour.` : ""}`}
            </p>
          )}
        </div>
      </section>

      {/* 2. Result: on phones it comes right after the transcript. */}
      <section
        aria-labelledby="result-title"
        className={`${cardClass} lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1`}
      >
        <Heading id="result-title" step={2} title="Your title and description">
          Edit anything, then copy each into YouTube Studio.
        </Heading>

        <ResultField
          label="Title"
          meta={`${draft.title.length}/${MAX_TITLE}`}
          warn={draft.title.length > MAX_TITLE}
          onCopy={() => void copy("title", draft.title)}
          canCopy={!!draft.title}
          copied={copied === "title"}
        >
          {aboveTitle.length > 0 && <p className="mb-1 text-sm text-sky-600 dark:text-sky-300">{aboveTitle.join(" ")}</p>}
          <input
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Your video title"
            aria-label="Title"
            className={`${inputClass} text-lg font-semibold`}
          />
        </ResultField>

        <ResultField
          label="Description"
          meta="Links, timestamps and hashtags included"
          onCopy={() => void copy("description", draft.body)}
          canCopy={!!draft.body}
          copied={copied === "description"}
        >
          <textarea
            value={draft.body}
            onChange={(e) => set("body", e.target.value)}
            rows={16}
            placeholder="Your description appears here: the intro, your links, timestamps, socials and hashtags, ready to paste. You can also write it yourself."
            aria-label="Description"
            className={`${inputClass} field-sizing-content h-auto min-h-72 py-2.5 leading-relaxed`}
          />
          {draft.body && missingLinks(draft) && (
            <button
              type="button"
              onClick={() => setDraft((d) => insertMissing(d))}
              className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted"
            >
              <Link2 className="size-4" />
              Add my links to the description
            </button>
          )}
        </ResultField>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold">YouTube checks</h3>
          <div className="mt-2 flex flex-col gap-1.5">
            {checks.map((c) => (
              <CheckLine key={c.text} check={c} />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
        >
          <RotateCcw className="size-4" />
          Start a new video
        </button>
      </section>

      {/* 3. Links and socials */}
      <section aria-labelledby="links-title" className={`${cardClass} lg:col-start-1 lg:row-start-2`}>
        <Heading id="links-title" step={3} title="Your links">
          Added to your description, and saved in this browser for your next video.
        </Heading>

        <div className="flex flex-col gap-3">
          {draft.links.map((link, i) => (
            <div key={link.id} className="flex flex-col gap-2 sm:flex-row">
              <input
                value={link.label}
                onChange={(e) => set("links", draft.links.map((l) => (l.id === link.id ? { ...l, label: e.target.value } : l)))}
                placeholder="Label, e.g. My camera"
                aria-label={`Link ${i + 1} label`}
                className={`${inputClass} sm:w-48`}
              />
              <div className="flex flex-1 gap-2">
                <input
                  value={link.url}
                  onChange={(e) => set("links", draft.links.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l)))}
                  placeholder="https://…"
                  inputMode="url"
                  aria-label={`Link ${i + 1} address`}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => set("links", draft.links.filter((l) => l.id !== link.id))}
                  aria-label={`Remove link ${i + 1}`}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set("links", [...draft.links, { id: crypto.randomUUID(), label: "", url: "" }])}
            className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
          >
            <Plus className="size-4" />
            Add link
          </button>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Social links</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {SOCIALS.map((s) => (
              <label key={s.id} className="block text-sm font-medium">
                <span className="mb-1 block">{s.label}</span>
                <input
                  value={draft.socials[s.id] ?? ""}
                  onChange={(e) => set("socials", { ...draft.socials, [s.id]: e.target.value })}
                  placeholder={s.placeholder}
                  spellCheck={false}
                  className={inputClass}
                />
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const cardClass = "flex min-w-0 flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:p-6";
const inputClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-[1.05rem] outline-none focus:border-muted-foreground";

function Heading({ id, step, title, children }: { id: string; step: number; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background"
      >
        {step}
      </span>
      <div>
        <h2 id={id} className="text-lg leading-7 font-semibold">
          {title}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}

function ResultField({
  label,
  meta,
  warn,
  onCopy,
  canCopy,
  copied,
  children,
}: {
  label: string;
  meta?: string;
  warn?: boolean;
  onCopy: () => void;
  canCopy: boolean;
  copied: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium">
          {label}
          {meta && <span className={`ml-2 font-normal ${warn ? "text-brand" : "text-muted-foreground"}`}>{meta}</span>}
        </span>
        <button
          type="button"
          onClick={onCopy}
          disabled={!canCopy}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : `Copy ${label.toLowerCase()}`}
        </button>
      </div>
      {children}
    </div>
  );
}
