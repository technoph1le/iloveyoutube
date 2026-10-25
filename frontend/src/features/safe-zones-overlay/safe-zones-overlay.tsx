"use client";

/* eslint-disable @next/next/no-img-element -- local blob: URLs of the
   creator's own images; next/image can't optimize those. */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type DragEvent, type ReactNode } from "react";
import { Download, Eye, ImagePlus, Tag, X } from "lucide-react";
import { CheckLine } from "@/components/ui/check-line";
import {
  BADGE_OPTIONS,
  CONTEXT_OPTIONS,
  FORMATS,
  checkImage,
  getLayout,
  thumbnailCardWidth,
  type FormatId,
  type Guide,
  type Layout,
  type Options,
  type Rect,
  type Zone,
} from "./formats";
import { renderTemplate } from "./template";

type Picture = { url: string; name: string; width: number; height: number; bytes: number };

function loadPicture(file: File): Promise<Picture> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () =>
      resolve({ url, name: file.name || "Pasted image", width: img.naturalWidth, height: img.naturalHeight, bytes: file.size });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Couldn't read ${file.name || "that image"}`));
    };
    img.src = url;
  });
}

export function SafeZonesOverlay() {
  const [format, setFormat] = useState<FormatId>("thumbnail");
  const [options, setOptions] = useState<Options>({ context: "home", badge: "short" });
  const [picture, setPicture] = useState<Picture | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const layout = useMemo(() => getLayout(format, options), [format, options]);
  const formatInfo = FORMATS.find((f) => f.id === format)!;

  // The current blob URL, revoked when replaced or on unmount.
  const pictureUrl = useRef<string | null>(null);
  useEffect(() => () => {
    if (pictureUrl.current) URL.revokeObjectURL(pictureUrl.current);
  }, []);

  async function addFiles(files: File[]) {
    setError(null);
    const file = files.find((f) => f.type.startsWith("image/"));
    if (!file) {
      if (files.length) setError("That isn't an image. Use JPG, PNG, GIF or WebP.");
      return;
    }
    try {
      const next = await loadPicture(file);
      if (pictureUrl.current) URL.revokeObjectURL(pictureUrl.current);
      pictureUrl.current = next.url;
      setPicture(next);
      // Portrait images are almost always Shorts.
      if (next.width < next.height) setFormat("shorts");
      else if (format === "shorts") setFormat("thumbnail");
    } catch (err) {
      setError((err as Error).message);
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

  function removePicture() {
    if (pictureUrl.current) URL.revokeObjectURL(pictureUrl.current);
    pictureUrl.current = null;
    setPicture(null);
    setError(null);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    void addFiles([...event.dataTransfer.files]);
  }

  async function downloadTemplate() {
    setDownloading(true);
    try {
      const blob = await renderTemplate(layout);
      const url = URL.createObjectURL(blob);
      const variant = format === "thumbnail" ? `-${options.context}` : "";
      const a = document.createElement("a");
      a.href = url;
      a.download = `youtube-${format}${variant}-safe-zones-${layout.width}x${layout.height}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setDownloading(false);
    }
  }

  const portrait = layout.height > layout.width;
  const legend = [
    ...new Map(layout.zones.map((z) => [z.label, z.kind])).entries(),
  ].map(([label, kind]) => ({ label, kind }));

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div role="tablist" aria-label="Format" className="inline-flex flex-wrap justify-center rounded-lg border border-border bg-card p-1">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={format === f.id}
              onClick={() => setFormat(f.id)}
              className={`h-9 rounded-md px-3 text-sm font-medium transition-colors ${
                format === f.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-6">
          <h2 className="sr-only">Preview: {formatInfo.label}</h2>
          <Preview
            picture={picture}
            layout={layout}
            overlay={showOverlay}
            labels={showLabels}
            style={portrait ? { maxWidth: "calc(75vh * 9 / 16)" } : undefined}
            empty
          />
          {format === "thumbnail" && (
            <div className="flex flex-col items-center gap-2">
              <Preview
                picture={picture}
                layout={layout}
                overlay={showOverlay}
                labels={false}
                style={{ width: thumbnailCardWidth(options.context), maxWidth: "100%" }}
              />
              <p className="text-sm text-muted-foreground">
                Actual size in {CONTEXT_OPTIONS.find((c) => c.id === options.context)!.label}
              </p>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-6">
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
              className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-5 text-center transition-colors ${
                dragging ? "border-brand bg-muted" : "border-border bg-card hover:bg-muted"
              }`}
            >
              <ImagePlus className="size-7" />
              <p className="font-medium">{picture ? "Replace image" : "Drop, paste or click to add an image"}</p>
              <p className="text-sm text-muted-foreground">Images stay on your device.</p>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  void addFiles([...(e.target.files ?? [])]);
                  e.target.value = "";
                }}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-brand">
                {error}
              </p>
            )}
            {picture && (
              <div className="flex gap-3 rounded-xl border border-border p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{picture.name}</p>
                  <div className="mt-1 flex flex-col gap-0.5">
                    {checkImage(format, picture).map((c) => (
                      <CheckLine key={c.text} check={c} />
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removePicture}
                  aria-label="Remove image"
                  className="self-start rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>

          {format === "thumbnail" && (
            <>
              <Segmented
                label="Where it appears"
                value={options.context}
                options={CONTEXT_OPTIONS}
                onChange={(context) => setOptions({ ...options, context })}
              />
              <Segmented
                label="Badge"
                value={options.badge}
                options={BADGE_OPTIONS}
                onChange={(badge) => setOptions({ ...options, badge })}
              />
            </>
          )}

          <div className="flex flex-wrap gap-2">
            <Toggle on={showOverlay} onClick={() => setShowOverlay(!showOverlay)} icon={<Eye className="size-4" />} label="Overlay" />
            <Toggle
              on={showLabels}
              onClick={() => setShowLabels(!showLabels)}
              icon={<Tag className="size-4" />}
              label="Labels"
              disabled={!showOverlay}
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold">What covers your image</h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm">
              {legend.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  <Swatch kind={item.kind} />
                  {item.label}
                </li>
              ))}
              {layout.guides.map((g) => (
                <li key={g.id} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={`size-3.5 shrink-0 rounded-sm border-2 border-dashed ${
                      g.tone === "safe" ? "border-green-500" : "border-sky-400"
                    }`}
                  />
                  {g.tone === "safe" ? `${g.label}: keep text and faces here` : `Visible on ${g.label.toLowerCase()}`}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">{formatInfo.note}</p>
          </div>

          <button
            type="button"
            onClick={() => void downloadTemplate()}
            disabled={downloading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-strong px-4 text-sm font-semibold text-white hover:bg-brand disabled:opacity-60"
          >
            <Download className="size-4" />
            Download template ({layout.width}×{layout.height} PNG)
          </button>
          <p className="-mt-3 text-xs text-muted-foreground">
            A transparent overlay to place on top of your design in Photoshop, Canva or any editor.
          </p>
        </aside>
      </div>
    </div>
  );
}

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

function boxStyle(rect: Rect, layout: Layout): CSSProperties {
  return {
    left: pct(rect.x, layout.width),
    top: pct(rect.y, layout.height),
    width: pct(rect.w, layout.width),
    height: pct(rect.h, layout.height),
  };
}

// Sizes inside the preview scale with its width (container query units), so
// the badge text stays true to scale at any preview size.
const cqw = (px: number, layout: Layout) => `${(px / layout.width) * 100}cqw`;

function Preview({
  picture,
  layout,
  overlay,
  labels,
  style,
  empty,
}: {
  picture: Picture | null;
  layout: Layout;
  overlay: boolean;
  labels: boolean;
  style?: CSSProperties;
  empty?: boolean;
}) {
  return (
    <div
      className="@container relative mx-auto w-full overflow-hidden rounded-xl border border-border bg-[repeating-conic-gradient(var(--muted)_0_25%,var(--card)_0_50%)] bg-size-[24px_24px]"
      style={{ aspectRatio: `${layout.width} / ${layout.height}`, ...style }}
    >
      {picture ? (
        <img src={picture.url} alt="Your image" className="absolute inset-0 size-full object-cover" />
      ) : (
        empty && (
          <p className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-muted-foreground">
            Add an image to check it
          </p>
        )
      )}
      {overlay && (
        <div aria-hidden className="absolute inset-0">
          {layout.zones.map((zone) => (
            <ZoneBox key={zone.id} zone={zone} layout={layout} labels={labels} />
          ))}
          {layout.guides.map((guide, i) => (
            <GuideBox key={guide.id} guide={guide} layout={layout} labels={labels} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function ZoneBox({ zone, layout, labels }: { zone: Zone; layout: Layout; labels: boolean }) {
  const style = boxStyle(zone.rect, layout);
  if (zone.kind === "badge") {
    return (
      <div
        className={`absolute flex items-center justify-center leading-none font-medium text-white ${
          zone.live ? "bg-[#cc0000]" : "bg-black/80"
        }`}
        style={{
          ...style,
          fontSize: cqw(zone.fontPx ?? 0, layout),
          borderRadius: cqw(zone.rect.h * 0.22, layout),
        }}
      >
        {zone.text}
      </div>
    );
  }
  // Thin zones go unlabeled; the legend lists them.
  const big = zone.rect.w / layout.width > 0.12 && zone.rect.h / layout.height > 0.06;
  // Labels of zones near the right edge grow leftwards so they aren't clipped.
  const atRightEdge = zone.rect.x + zone.rect.w >= layout.width * 0.95;
  if (zone.kind === "crop") {
    return (
      <div className="absolute flex items-center justify-center bg-black/60" style={style}>
        {labels && big && <Label>{zone.label}</Label>}
      </div>
    );
  }
  return (
    <div className="absolute border border-red-500 bg-red-500/35" style={style}>
      {labels && big && (
        <span className={`absolute top-0 ${atRightEdge ? "right-0" : "left-0"}`}>
          <Label>{zone.label}</Label>
        </span>
      )}
    </div>
  );
}

function GuideBox({ guide, layout, labels, index }: { guide: Guide; layout: Layout; labels: boolean; index: number }) {
  // Nested guides share a top edge, so their labels are spread out.
  const position =
    guide.tone === "safe" ? "top-0 left-1/2 -translate-x-1/2" : index % 2 ? "bottom-0 left-0" : "top-0 left-0";
  return (
    <div
      className={`absolute border-2 border-dashed ${guide.tone === "safe" ? "border-green-400" : "border-sky-300"}`}
      style={boxStyle(guide.rect, layout)}
    >
      {labels && (
        <span className={`absolute ${position}`}>
          <Label tone={guide.tone}>{guide.label}</Label>
        </span>
      )}
    </div>
  );
}

function Label({ children, tone }: { children: ReactNode; tone?: Guide["tone"] }) {
  const color = tone === "safe" ? "bg-green-700" : tone === "info" ? "bg-sky-700" : "bg-black/70";
  return (
    <span
      className={`m-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap text-white sm:text-xs ${color}`}
    >
      {children}
    </span>
  );
}

function Swatch({ kind }: { kind: Zone["kind"] }) {
  const color =
    kind === "crop" ? "bg-black/60 border-border" : kind === "badge" ? "bg-black/80 border-black" : "bg-red-500/35 border-red-500";
  return <span aria-hidden className={`size-3.5 shrink-0 rounded-sm border ${color}`} />;
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label}>
      <p className="mb-1.5 text-sm font-medium">{label}</p>
      <div className="inline-flex flex-wrap rounded-lg border border-border bg-card p-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className={`h-9 rounded-md px-3 text-sm font-medium transition-colors ${
              value === o.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
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
