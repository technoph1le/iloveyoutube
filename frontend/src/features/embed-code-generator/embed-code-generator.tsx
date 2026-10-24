"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Copy, Play, RotateCcw } from "lucide-react";
import {
  DEFAULT_OPTIONS,
  embedHtml,
  embedJsx,
  embedSrc,
  formatTime,
  isShortsUrl,
  parseTime,
  startFromUrl,
  type Aspect,
  type EmbedOptions,
} from "@/features/embed-code-generator/embed-code";
import { thumbnailPath } from "@/utils/images";
import { parseVideoId } from "@/utils/youtube-url";

// Shown on first visit so people see a working player before pasting.
const EXAMPLE_ID = "dQw4w9WgXcQ";

type Lookup = { id: string; status: "ok"; title: string | null } | { id: string; status: "not-found" | "error" };
type SizeChoice = Aspect | "fixed";

const SIZE_CHOICES: { value: SizeChoice; label: string }[] = [
  { value: "16 / 9", label: "16:9" },
  { value: "9 / 16", label: "9:16 Shorts" },
  { value: "4 / 3", label: "4:3" },
  { value: "fixed", label: "Fixed size" },
];

export function EmbedCodeGenerator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sharedId = parseVideoId(searchParams.get("v") ?? "");
  const [input, setInput] = useState(sharedId ? `https://youtu.be/${sharedId}` : "");
  const [videoId, setVideoId] = useState(sharedId ?? EXAMPLE_ID);
  const [isExample, setIsExample] = useState(!sharedId);
  const [options, setOptions] = useState<EmbedOptions>(DEFAULT_OPTIONS);
  const [startText, setStartText] = useState("");
  const [endText, setEndText] = useState("");
  const [fixedSize, setFixedSize] = useState({ width: 560, height: 315 });
  const [codeTab, setCodeTab] = useState<"html" | "react">("html");
  const [copied, setCopied] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [lookupState, setLookupState] = useState<Lookup | null>(null);
  // YouTube's player connects to Google, so it only loads after the visitor
  // agrees (GDPR). Until then the preview is a local thumbnail.
  const [playerAllowed, setPlayerAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/videos/${videoId}`)
      .then(async (res) => {
        if (!res.ok) return { id: videoId, status: res.status === 404 ? "not-found" : "error" } as const;
        const data = (await res.json()) as { title?: string | null };
        return { id: videoId, status: "ok", title: data.title ?? null } as const;
      })
      .catch(() => ({ id: videoId, status: "error" }) as const)
      .then((result) => {
        if (!cancelled) setLookupState(result);
      });
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  function lookup(value: string) {
    const id = parseVideoId(value);
    if (!id) {
      setInputError("That doesn't look like a YouTube video link. Try one like youtube.com/watch?v=… or youtu.be/…");
      return;
    }
    setInputError(null);
    setIsExample(false);
    setVideoId(id);
    // Carry over what the link itself says: a start time, or that it's a Short.
    const start = startFromUrl(value);
    setStartText(start ? formatTime(start) : "");
    setOptions((o) => ({
      ...o,
      start,
      size: isShortsUrl(value) ? { mode: "responsive", aspect: "9 / 16" } : o.size,
    }));
    router.replace(`?v=${id}`, { scroll: false });
  }

  const set = <K extends keyof EmbedOptions>(key: K, value: EmbedOptions[K]) =>
    setOptions((o) => ({ ...o, [key]: value }));

  function setTime(which: "start" | "end", text: string) {
    (which === "start" ? setStartText : setEndText)(text);
    set(which, parseTime(text));
  }

  function setSize(choice: SizeChoice) {
    set("size", choice === "fixed" ? { mode: "fixed", ...fixedSize } : { mode: "responsive", aspect: choice });
  }

  function setFixed(dimension: "width" | "height", value: number) {
    const next = { ...fixedSize, [dimension]: Math.max(1, value || 0) };
    setFixedSize(next);
    set("size", { mode: "fixed", ...next });
  }

  function reset() {
    setOptions(DEFAULT_OPTIONS);
    setStartText("");
    setEndText("");
    setFixedSize({ width: 560, height: 315 });
  }

  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const current = lookupState?.id === videoId ? lookupState : null;
  const title = (current?.status === "ok" && current.title) || "YouTube video player";
  const code = codeTab === "html" ? embedHtml(videoId, title, options) : embedJsx(videoId, title, options);
  const startInvalid = startText.trim() !== "" && options.start === null;
  const endInvalid =
    endText.trim() !== "" && (options.end === null || (options.start !== null && options.end <= options.start));
  const sizeChoice: SizeChoice = options.size.mode === "fixed" ? "fixed" : options.size.aspect;

  return (
    <div className="w-full">
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          lookup(input);
        }}
        className="mx-auto flex max-w-2xl gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (parseVideoId(text)) {
              e.preventDefault();
              setInput(text.trim());
              lookup(text);
            }
          }}
          placeholder="Paste a YouTube video link"
          aria-label="YouTube video link"
          className="h-12 min-w-0 flex-1 rounded-lg border border-border bg-card px-4 text-[1.05rem] outline-none focus:border-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Generate embed code"
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-foreground px-4 font-medium text-background transition-opacity hover:opacity-90"
        >
          <span className="hidden sm:inline">Generate</span>
          <ArrowRight className="size-5" />
        </button>
      </form>
      <p className={`mt-3 text-center text-sm ${inputError ? "text-brand" : "text-muted-foreground"}`} role={inputError ? "alert" : undefined}>
        {inputError ?? "Works with videos, Shorts and live streams. Links with a timestamp set the start time."}
      </p>

      {current?.status === "not-found" ? (
        <p role="alert" className="mt-10 text-center text-muted-foreground">
          This video can&apos;t be embedded. It may be private, deleted or not public yet.
        </p>
      ) : (
        <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-[auto_1fr]">
          <div className="min-w-0">
            <div className="mb-3 min-h-12">
              {isExample && <p className="text-sm font-medium tracking-wide text-brand uppercase">Example</p>}
              <h2 className="truncate text-xl font-bold">
                {current?.status === "ok" ? title : <span className="inline-block h-6 w-72 animate-pulse rounded bg-muted align-middle" />}
              </h2>
            </div>

            {/* Live preview: the real embed with the current settings. */}
            <div className="flex justify-center overflow-auto rounded-2xl border border-border bg-muted/40 p-4">
              {playerAllowed ? (
                <iframe
                  key={options.privacy ? "nocookie" : "youtube"}
                  src={embedSrc(videoId, options)}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen={options.fullscreen}
                  className="max-w-full shrink-0 rounded-lg border-0 bg-black"
                  style={previewStyle(options)}
                />
              ) : (
                <div
                  className="relative max-w-full shrink-0 overflow-hidden rounded-lg bg-black"
                  style={previewStyle(options)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- served by our backend */}
                  <img
                    src={thumbnailPath(videoId, "hqdefault", "jpg")}
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-50"
                  />
                  <div className="relative flex size-full flex-col items-center justify-center gap-3 p-4 text-center text-white">
                    <button
                      type="button"
                      onClick={() => setPlayerAllowed(true)}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-strong px-5 font-medium text-white transition-opacity hover:opacity-90"
                    >
                      <Play className="size-4 fill-white" aria-hidden />
                      Load live preview
                    </button>
                    <p className="max-w-sm text-sm text-white/90">
                      The preview is YouTube&apos;s real player, which connects to Google&apos;s servers.{" "}
                      <Link href="/privacy" className="underline underline-offset-2">
                        Privacy policy
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <aside className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <Section title="Playback">
              <Switch
                label="Autoplay"
                hint="Starts muted. Browsers block autoplay with sound."
                checked={options.autoplay}
                onChange={(v) => set("autoplay", v)}
              />
              <Switch
                label="Mute"
                checked={options.mute || options.autoplay}
                disabled={options.autoplay}
                onChange={(v) => set("mute", v)}
              />
              <Switch label="Loop" checked={options.loop} onChange={(v) => set("loop", v)} />
              <div className="grid grid-cols-2 gap-3">
                <TimeField label="Start at" value={startText} invalid={startInvalid} onChange={(v) => setTime("start", v)} />
                <TimeField label="End at" value={endText} invalid={endInvalid} onChange={(v) => setTime("end", v)} />
              </div>
              {endInvalid && options.end !== null && (
                <p className="text-xs text-brand">End time must be after the start time.</p>
              )}
            </Section>

            <Section title="Player">
              <Switch label="Show controls" checked={options.controls} onChange={(v) => set("controls", v)} />
              <Switch label="Captions on by default" checked={options.captions} onChange={(v) => set("captions", v)} />
              <Switch label="Fullscreen button" checked={options.fullscreen} onChange={(v) => set("fullscreen", v)} />
              <Switch label="Keyboard shortcuts" checked={options.keyboard} onChange={(v) => set("keyboard", v)} />
              <Switch
                label="Related videos from this channel only"
                hint="Shown when the video ends."
                checked={options.sameChannelRelated}
                onChange={(v) => set("sameChannelRelated", v)}
              />
            </Section>

            <Section title="Size">
              <div className="grid grid-cols-2 gap-2">
                {SIZE_CHOICES.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    aria-pressed={sizeChoice === choice.value}
                    onClick={() => setSize(choice.value)}
                    className={`h-9 rounded-lg border text-sm font-medium ${
                      sizeChoice === choice.value
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {options.size.mode === "fixed"
                  ? "Always the same pixel size."
                  : "Fills the width of its container and keeps its shape on every screen."}
              </p>
              {options.size.mode === "fixed" && (
                <div className="flex items-center gap-2">
                  <NumberField label="Width" value={fixedSize.width} onChange={(v) => setFixed("width", v)} />
                  <span className="mt-6 text-muted-foreground">×</span>
                  <NumberField label="Height" value={fixedSize.height} onChange={(v) => setFixed("height", v)} />
                </div>
              )}
            </Section>

            <Section title="Privacy & speed">
              <Switch
                label="Privacy-enhanced mode"
                hint="No YouTube cookies until the visitor presses play."
                checked={options.privacy}
                onChange={(v) => set("privacy", v)}
              />
              <Switch
                label="Lazy loading"
                hint="Loads the player only when it scrolls into view."
                checked={options.lazy}
                onChange={(v) => set("lazy", v)}
              />
            </Section>

            <button
              type="button"
              onClick={reset}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium hover:bg-muted"
            >
              <RotateCcw className="size-4" />
              Reset settings
            </button>
          </aside>

          {/* Code: after the settings on phones (configure, then copy); under
              the preview on desktop, with the settings alongside. */}
          <div className="min-w-0 lg:col-start-1 lg:row-start-2 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <div role="tablist" aria-label="Code format" className="flex gap-1">
                  {(["html", "react"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={codeTab === tab}
                      onClick={() => setCodeTab(tab)}
                      className={`h-8 rounded-md px-3 text-sm font-medium ${
                        codeTab === tab ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab === "html" ? "HTML" : "React"}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => copyCode(code)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "Copied" : "Copy code"}
                </button>
              </div>
              {/* Wrapped rather than scrolled sideways, so nothing is hidden;
                  copying uses the unwrapped text. */}
              <pre className="p-4 text-sm leading-relaxed whitespace-pre-wrap wrap-anywhere">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// The preview takes the size the embed will have on the visitor's site.
function previewStyle(options: EmbedOptions) {
  return options.size.mode === "fixed"
    ? { width: options.size.width, height: options.size.height }
    : {
        width: "100%",
        aspectRatio: options.size.aspect,
        maxWidth: options.size.aspect === "9 / 16" ? 360 : undefined,
      };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
      {children}
    </section>
  );
}

function Switch({
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex items-start justify-between gap-3 text-left disabled:opacity-60"
    >
      <span>
        <span className="block text-[0.95rem]">{label}</span>
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
      <span
        aria-hidden
        className={`mt-0.5 flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          checked ? "bg-brand" : "bg-muted"
        }`}
      >
        <span className={`size-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
      </span>
    </button>
  );
}

const fieldClass =
  "mt-1 h-10 w-full rounded-lg border bg-background px-3 text-[0.95rem] outline-none focus:border-muted-foreground";

function TimeField({
  label,
  value,
  invalid,
  onChange,
}: {
  label: string;
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0:00"
        inputMode="numeric"
        aria-invalid={invalid}
        className={`${fieldClass} ${invalid ? "border-brand" : "border-border"}`}
      />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block flex-1 text-sm">
      {label}
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`${fieldClass} border-border`}
      />
    </label>
  );
}
