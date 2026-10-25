"use client";

/* eslint-disable @next/next/no-img-element -- local blob: URLs of the
   creator's own images; next/image can't optimize those. */
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { Eye, ImagePlus, Moon, RotateCcw, Shuffle, Sun, Target, X } from "lucide-react";
import { CheckLine, type Check } from "@/components/ui/check-line";
import { buildCards, type Feed, type Mine } from "@/features/thumbnail-previewer/feed";
import {
  HomeView,
  MobileView,
  SearchView,
  TvView,
  UpNextView,
  VIEWS,
  YtFrame,
  type ViewId,
  type YtTheme,
} from "./views";

const MAX_VARIANTS = 3;
const MAX_BYTES = 2 * 1024 * 1024; // YouTube's custom thumbnail limit
const TITLE_LIMIT = 100; // YouTube's title limit

type Variant = { id: string; url: string; name: string; width: number; height: number; bytes: number };

function checkVariant(v: Variant): Check[] {
  const ratio = v.width / v.height;
  const checks: Check[] = [];
  checks.push(
    Math.abs(ratio - 16 / 9) < 0.02
      ? { level: "ok", text: "16:9" }
      : { level: "warn", text: `Not 16:9 (${v.width}×${v.height}), so YouTube will crop or add bars` },
  );
  checks.push(
    v.width >= 1280 && v.height >= 720
      ? { level: "ok", text: `${v.width}×${v.height}` }
      : v.width >= 640
        ? { level: "warn", text: `${v.width}×${v.height}: 1280×720 or larger recommended` }
        : { level: "error", text: `${v.width}px wide: under YouTube's 640px minimum` },
  );
  checks.push(
    v.bytes <= MAX_BYTES
      ? { level: "ok", text: `${(v.bytes / 1024 / 1024).toFixed(2)} MB` }
      : { level: "error", text: `${(v.bytes / 1024 / 1024).toFixed(1)} MB: over YouTube's 2 MB limit` },
  );
  return checks;
}

function loadVariant(file: File): Promise<Variant> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () =>
      resolve({
        id: crypto.randomUUID(),
        url,
        name: file.name || "Pasted image",
        width: img.naturalWidth,
        height: img.naturalHeight,
        bytes: file.size,
      });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Couldn't read ${file.name || "that image"}`));
    };
    img.src = url;
  });
}

const EMPTY_DETAILS = { title: "", channel: "", views: 12000, duration: "12:34" };

export function ThumbnailPreviewer() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [view, setView] = useState<ViewId>("home");
  const [ytTheme, setYtTheme] = useState<YtTheme>("dark");
  const [squint, setSquint] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [seed, setSeed] = useState(1);
  const [category, setCategory] = useState("all");
  const [feed, setFeed] = useState<Feed | null>(null);
  const [feedError, setFeedError] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Blob URLs to revoke on unmount.
  const urls = useRef(new Set<string>());
  useEffect(() => {
    const owned = urls.current;
    return () => owned.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  useEffect(() => {
    fetch("/api/thumbnail-previewer/feed")
      .then((res) => (res.ok ? (res.json() as Promise<Feed>) : Promise.reject(new Error(String(res.status)))))
      .then(setFeed)
      .catch(() => setFeedError(true));
  }, []);

  async function addFiles(files: File[]) {
    setUploadError(null);
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (!images.length) {
      if (files.length) setUploadError("That isn't an image. Use JPG, PNG, GIF or WebP.");
      return;
    }
    const room = MAX_VARIANTS - variants.length;
    if (room <= 0) {
      setUploadError(`You can compare up to ${MAX_VARIANTS} thumbnails. Remove one first.`);
      return;
    }
    try {
      const added = await Promise.all(images.slice(0, room).map(loadVariant));
      added.forEach((v) => urls.current.add(v.url));
      setVariants((prev) => [...prev, ...added]);
      setActiveId(added[added.length - 1].id);
      if (images.length > room) setUploadError(`Only the first ${room} image(s) were added.`);
    } catch (err) {
      setUploadError((err as Error).message);
    }
  }

  // Paste a screenshot or copied image anywhere on the page.
  const addFilesRef = useRef(addFiles);
  useEffect(() => {
    addFilesRef.current = addFiles;
  });
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const files = [...(event.clipboardData?.files ?? [])];
      if (files.some((f) => f.type.startsWith("image/"))) {
        event.preventDefault();
        void addFilesRef.current(files);
      }
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, []);

  function removeVariant(id: string) {
    const target = variants.find((v) => v.id === id);
    if (target) {
      URL.revokeObjectURL(target.url);
      urls.current.delete(target.url);
    }
    const rest = variants.filter((v) => v.id !== id);
    setVariants(rest);
    if (activeId === id) setActiveId(rest[0]?.id ?? null);
  }

  function onAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file?.type.startsWith("image/")) return;
    if (avatar) URL.revokeObjectURL(avatar);
    const url = URL.createObjectURL(file);
    urls.current.add(url);
    setAvatar(url);
  }

  function reset() {
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current.clear();
    setVariants([]);
    setActiveId(null);
    setAvatar(null);
    setDetails(EMPTY_DETAILS);
    setUploadError(null);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    void addFiles([...event.dataTransfer.files]);
  }

  const active = variants.find((v) => v.id === activeId) ?? null;
  const mine: Mine = {
    thumbnail: active?.url ?? null,
    title: details.title,
    channel: details.channel,
    avatar,
    views: details.views,
    duration: details.duration,
  };

  const viewConfig = VIEWS.find((v) => v.id === view)!;
  const videos = useMemo(() => {
    if (!feed) return null;
    const pool = feed.videos.filter((v) => view !== "home" || v.categories.includes(category));
    return pool.length ? pool : feed.videos;
  }, [feed, view, category]);
  const cards = useMemo(
    () => buildCards(videos, viewConfig.cards, seed, viewConfig.slotRange),
    [videos, viewConfig, seed],
  );
  const fetchedAt = feed?.fetchedAt ?? "2026-01-01T00:00:00Z";
  const viewProps = { cards, mine, fetchedAt, highlight };

  const chips = (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {(feed?.categories ?? [{ id: "all", label: "All" }]).map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => setCategory(c.id)}
          className={`h-8 shrink-0 rounded-lg px-3 text-sm font-medium ${
            category === c.id
              ? "bg-(--yt-chip-active) text-(--yt-chip-active-text)"
              : "bg-(--yt-chip) text-(--yt-text)"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {/* Inputs */}
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInput.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInput.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
              dragging ? "border-brand bg-muted" : "border-border bg-card hover:bg-muted"
            }`}
          >
            <ImagePlus className="size-8" />
            <p className="font-medium">Drop, paste or click to add a thumbnail</p>
            <p className="text-sm text-muted-foreground">
              Add up to {MAX_VARIANTS} versions to compare. Images stay on your device.
            </p>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                void addFiles([...(e.target.files ?? [])]);
                e.target.value = "";
              }}
            />
          </div>
          {uploadError && (
            <p role="alert" className="text-sm text-brand">
              {uploadError}
            </p>
          )}

          {variants.map((v, i) => (
            <div
              key={v.id}
              className={`flex gap-3 rounded-xl border p-2 ${v.id === activeId ? "border-foreground" : "border-border"}`}
            >
              <button
                type="button"
                onClick={() => setActiveId(v.id)}
                aria-pressed={v.id === activeId}
                className="flex min-w-0 flex-1 gap-3 text-left"
              >
                <img src={v.url} alt="" className="aspect-video w-28 shrink-0 rounded-md object-cover" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {String.fromCharCode(65 + i)} · {v.name}
                  </span>
                  <span className="mt-1 flex flex-col gap-0.5">
                    {checkVariant(v).map((c) => (
                      <CheckLine key={c.text} check={c} />
                    ))}
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => removeVariant(v.id)}
                aria-label={`Remove thumbnail ${String.fromCharCode(65 + i)}`}
                className="self-start rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Field label="Video title" hint={`${details.title.length}/${TITLE_LIMIT}`} warn={details.title.length > TITLE_LIMIT}>
            <input
              value={details.title}
              onChange={(e) => setDetails({ ...details, title: e.target.value })}
              placeholder="e.g. The Ultimate YouTube Guide"
              className={inputClass}
            />
          </Field>
          <Field label="Channel name">
            <div className="flex gap-2">
              <input
                value={details.channel}
                onChange={(e) => setDetails({ ...details, channel: e.target.value })}
                placeholder="e.g. PewDiePie"
                className={inputClass}
              />
              <label className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 text-sm hover:bg-muted">
                {avatar ? (
                  <img src={avatar} alt="" className="size-6 rounded-full object-cover" />
                ) : (
                  <ImagePlus className="size-4" />
                )}
                Avatar
                <input type="file" accept="image/*" hidden onChange={onAvatar} />
              </label>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Views">
              <input
                type="number"
                min={0}
                value={details.views}
                onChange={(e) => setDetails({ ...details, views: Math.max(0, Number(e.target.value) || 0) })}
                className={inputClass}
              />
            </Field>
            <Field label="Duration">
              <input
                value={details.duration}
                onChange={(e) => setDetails({ ...details, duration: e.target.value })}
                placeholder="12:34"
                className={inputClass}
              />
            </Field>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
        </div>
      </div>

      {/* View switcher and options */}
      <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-3">
        <div role="tablist" aria-label="Preview" className="inline-flex flex-wrap rounded-lg border border-border bg-card p-1">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              onClick={() => setView(v.id)}
              className={`h-9 rounded-md px-3 text-sm font-medium transition-colors ${
                view === v.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        {variants.length > 1 && (
          <div className="inline-flex rounded-lg border border-border bg-card p-1" aria-label="Thumbnail version">
            {variants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={v.id === activeId}
                onClick={() => setActiveId(v.id)}
                className={`h-9 w-9 rounded-md text-sm font-semibold ${
                  v.id === activeId ? "bg-brand-strong text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </button>
            ))}
          </div>
        )}
        <Toggle
          on={false}
          onClick={() => setYtTheme(ytTheme === "dark" ? "light" : "dark")}
          icon={ytTheme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          label={ytTheme === "dark" ? "Dark" : "Light"}
          disabled={view === "tv"}
        />
        <Toggle on={squint} onClick={() => setSquint(!squint)} icon={<Eye className="size-4" />} label="Squint test" />
        <Toggle on={highlight} onClick={() => setHighlight(!highlight)} icon={<Target className="size-4" />} label="Find mine" />
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-muted"
        >
          <Shuffle className="size-4" />
          Shuffle
        </button>
      </div>

      {feedError && (
        <p className="mx-auto mt-4 max-w-5xl text-center text-sm text-muted-foreground">
          Trending videos couldn&apos;t be loaded, so placeholders fill the feed. Your preview still works.
        </p>
      )}

      {/* Preview. The hidden heading keeps the outline valid: the mock video
          titles inside are h3, as on YouTube. */}
      <h2 className="sr-only">Preview: {VIEWS.find((v) => v.id === view)?.label}</h2>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <YtFrame theme={view === "tv" ? "dark" : ytTheme}>
          <div className={squint ? "blur-[3px]" : undefined}>
            {view === "home" && <HomeView {...viewProps} chips={chips} />}
            {view === "search" && <SearchView {...viewProps} />}
            {view === "up-next" && <UpNextView {...viewProps} />}
            {view === "mobile" && <MobileView {...viewProps} />}
            {view === "tv" && <TvView {...viewProps} />}
          </div>
        </YtFrame>
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-[1.05rem] outline-none focus:border-muted-foreground";

function Field({ label, hint, warn, children }: { label: string; hint?: string; warn?: boolean; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      <span className="mb-1.5 flex justify-between">
        {label}
        {hint && <span className={warn ? "text-brand" : "text-muted-foreground"}>{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  on,
  onClick,
  icon,
  label,
  disabled,
}: {
  on: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors disabled:opacity-50 ${
        on ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:bg-muted"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
