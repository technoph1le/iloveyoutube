"use client";

/* eslint-disable @next/next/no-img-element -- thumbnails come straight from
   our backend at fixed sizes; next/image's optimizer adds nothing. */
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Copy, Download, ExternalLink, Link2 } from "lucide-react";
import { thumbnailPath } from "@/utils/images";
import { parseVideoId, THUMBNAIL_SIZES, thumbnailUrl, type ImageFormat } from "@/utils/youtube-url";

type SizeKey = (typeof THUMBNAIL_SIZES)[number]["key"];
type VideoInfo = {
  id: string;
  title: string | null;
  author: string | null;
  authorUrl: string | null;
  sizes: Record<ImageFormat, Record<SizeKey, number | null>>;
};
type Lookup =
  | { id: string; status: "ok"; info: VideoInfo }
  | { id: string; status: "not-found" | "error" };

// Shown on first visit so people see what they'll get before pasting.
const EXAMPLE_ID = "dQw4w9WgXcQ";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// The clipboard only reliably accepts PNG, so re-encode via a canvas.
async function toPng(blob: Blob) {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((png) => (png ? resolve(png) : reject(new Error("PNG encoding failed"))), "image/png"),
  );
}

export function ThumbnailDownloader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sharedId = parseVideoId(searchParams.get("v") ?? "");
  const [input, setInput] = useState(sharedId ? `https://youtu.be/${sharedId}` : "");
  const [videoId, setVideoId] = useState(sharedId ?? EXAMPLE_ID);
  const [isExample, setIsExample] = useState(!sharedId);
  const [format, setFormat] = useState<ImageFormat>("jpg");
  const [lookupState, setLookupState] = useState<Lookup | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Title, channel and which sizes exist come from the backend, which checks
  // YouTube directly, so browser extensions can't skew the result.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/videos/${videoId}`)
      .then(async (res) => {
        if (!res.ok) return { id: videoId, status: res.status === 404 ? "not-found" : "error" } as const;
        const info = (await res.json()) as VideoInfo;
        // Guard against an unexpected shape (e.g. an old cached response)
        // rather than crashing the page.
        if (typeof info?.sizes?.jpg !== "object" || typeof info.sizes.webp !== "object") {
          return { id: videoId, status: "error" } as const;
        }
        return { id: videoId, status: "ok", info } as const;
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
    setActionError(null);
    setIsExample(false);
    setVideoId(id);
    router.replace(`?v=${id}`, { scroll: false });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    lookup(input);
  }

  function flash(key: string) {
    setCopied(key);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 2000);
  }

  async function copyImage(downloadUrl: string, key: string) {
    setActionError(null);
    try {
      const png = fetch(downloadUrl)
        .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(String(res.status)))))
        .then(toPng);
      // Passing the promise keeps Safari's user-gesture requirement happy.
      await navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
      flash(key);
    } catch {
      setActionError("Your browser didn't allow copying the image. Use Download instead.");
    }
  }

  async function copyLink(url: string, key: string) {
    setActionError(null);
    try {
      await navigator.clipboard.writeText(url);
      flash(key);
    } catch {
      setActionError("Your browser didn't allow copying. Right-click the image to copy its address instead.");
    }
  }

  const current = lookupState?.id === videoId ? lookupState : null;
  const info = current?.status === "ok" ? current.info : null;
  const available = info ? THUMBNAIL_SIZES.filter((s) => info.sizes[format][s.key] !== null) : [];
  const missing = info ? THUMBNAIL_SIZES.filter((s) => info.sizes[format][s.key] === null) : [];
  const baseName = (info?.title && slugify(info.title)) || videoId;

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="mx-auto flex max-w-2xl gap-2">
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
          aria-label="Get thumbnails"
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-foreground px-4 font-medium text-background transition-opacity hover:opacity-90"
        >
          <span className="hidden sm:inline">Get thumbnails</span>
          <ArrowRight className="size-5" />
        </button>
      </form>
      <p className={`mt-3 text-center text-sm ${inputError ? "text-brand" : "text-muted-foreground"}`} role={inputError ? "alert" : undefined}>
        {inputError ?? "Works with videos, Shorts, live streams and embeds."}
      </p>

      <div className="mx-auto mt-10 max-w-5xl">
        {current?.status === "not-found" && (
          <p role="alert" className="text-center text-muted-foreground">
            No thumbnails found for this video. It may be private, deleted or not public yet.
          </p>
        )}
        {current?.status === "error" && (
          <p role="alert" className="text-center text-muted-foreground">
            Couldn&apos;t reach YouTube just now. Please try again in a moment.
          </p>
        )}

        {(info || !current) && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                {isExample && (
                  <p className="mb-1 text-sm font-medium tracking-wide text-brand uppercase">Example</p>
                )}
                {info ? (
                  <>
                    <h2 className="truncate text-xl font-bold">{info.title ?? `Video ${videoId}`}</h2>
                    {info.author && info.authorUrl && (
                      <a
                        href={info.authorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {info.author}
                      </a>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col gap-2" aria-label="Loading">
                    <span className="h-6 w-72 animate-pulse rounded bg-muted" />
                    <span className="h-4 w-32 animate-pulse rounded bg-muted" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div role="radiogroup" aria-label="Image format" className="inline-flex rounded-lg border border-border bg-card p-1">
                  {(["jpg", "webp"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      role="radio"
                      aria-checked={format === f}
                      onClick={() => setFormat(f)}
                      className={`h-8 rounded-md px-3 text-sm font-medium uppercase ${
                        format === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm hover:bg-muted"
                >
                  <ExternalLink className="size-4" />
                  YouTube
                </a>
              </div>
            </div>

            {actionError && (
              <p role="alert" className="mt-4 text-sm text-brand">
                {actionError}
              </p>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {(info ? available : THUMBNAIL_SIZES.slice(0, 3)).map((size, index) => {
                const isBest = index === 0;
                const bytes = info?.sizes[format][size.key];
                const remote = thumbnailUrl(videoId, size.key, format);
                const suffix = size.key.replace("default", "") || "small";
                const downloadUrl = thumbnailPath(videoId, size.key, format, { name: `${baseName}-${suffix}` });
                const displayUrl = thumbnailPath(videoId, size.key, format);
                return (
                  <div
                    key={size.key}
                    className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-card ${isBest ? "md:col-span-2" : ""}`}
                  >
                    {/* Same 16:9 frame for every size so cards line up; images
                        never scale above their real size, so small ones look
                        as small as the file actually is. */}
                    <div className="flex aspect-video items-center justify-center bg-muted">
                      {info && (
                        <img
                          src={displayUrl}
                          alt={`${size.label} thumbnail`}
                          width={size.width}
                          height={size.height}
                          className="h-auto max-h-full w-auto max-w-full"
                          loading={isBest ? "eager" : "lazy"}
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div>
                        <p className="font-semibold">
                          {size.label} ({size.width}×{size.height})
                          {isBest && info && (
                            <span className="ml-2 rounded-full bg-brand-strong px-2 py-0.5 text-xs font-medium text-white">
                              Best available
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {bytes ? formatBytes(bytes) : " "}
                          {bytes && size.width / size.height < 1.5 ? " · 4:3 with black bars on 16:9 videos" : ""}
                        </p>
                      </div>
                      {info && (
                        <div className="flex flex-wrap gap-2">
                          {isBest && (
                            <>
                              <ActionButton
                                onClick={() => copyLink(remote, `${size.key}-link`)}
                                done={copied === `${size.key}-link`}
                                icon={<Link2 className="size-4" />}
                                label="Copy link"
                              />
                              <ActionButton
                                onClick={() => copyImage(downloadUrl, `${size.key}-image`)}
                                done={copied === `${size.key}-image`}
                                icon={<Copy className="size-4" />}
                                label="Copy image"
                              />
                            </>
                          )}
                          <a
                            href={downloadUrl}
                            download
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
                          >
                            <Download className="size-4" />
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {missing.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                YouTube didn&apos;t create {missing.map((s) => `${s.label} (${s.width}×${s.height})`).join(" or ")}{" "}
                versions for this video, usually because it was uploaded in low resolution or long ago.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  done,
  icon,
  label,
}: {
  onClick: () => void;
  done: boolean;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted"
    >
      {done ? <Check className="size-4 text-green-500" /> : icon}
      {done ? "Copied" : label}
    </button>
  );
}
