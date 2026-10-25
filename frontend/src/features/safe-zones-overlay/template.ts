import type { Layout } from "./formats";

// Draws the overlay at the format's full resolution on a transparent
// background, for use as a guide layer in an image editor.
export function renderTemplate(layout: Layout): Promise<Blob> {
  const { width, height, zones, guides } = layout;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const unit = Math.max(width, height) / 1000;
  const labelFont = `600 ${Math.round(14 * unit)}px system-ui, sans-serif`;

  function label(text: string, x: number, y: number) {
    ctx.font = labelFont;
    ctx.textBaseline = "top";
    ctx.lineWidth = 4 * unit;
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = "#fff";
    ctx.fillText(text, x, y);
  }

  for (const zone of zones) {
    const { x, y, w, h } = zone.rect;
    if (zone.kind === "badge") {
      ctx.fillStyle = zone.live ? "#cc0000" : "rgba(0,0,0,0.8)";
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, h * 0.22);
      ctx.fill();
      ctx.font = `500 ${zone.fontPx}px Roboto, Arial, sans-serif`;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(zone.text ?? "", x + w / 2, y + h / 2);
      ctx.textAlign = "start";
      continue;
    }
    ctx.fillStyle = zone.kind === "crop" ? "rgba(0,0,0,0.6)" : "rgba(239,68,68,0.35)";
    ctx.fillRect(x, y, w, h);
    if (zone.kind === "ui") {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2 * unit;
      ctx.strokeRect(x, y, w, h);
    }
    if (w > 120 * unit && h > 24 * unit) label(zone.label, x + 8 * unit, y + 8 * unit);
  }

  for (const guide of guides) {
    const { x, y, w, h } = guide.rect;
    ctx.strokeStyle = guide.tone === "safe" ? "#22c55e" : "#38bdf8";
    ctx.lineWidth = 3 * unit;
    ctx.setLineDash([12 * unit, 8 * unit]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
    label(guide.label, x + 8 * unit, y + 8 * unit);
  }

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't create the image"))), "image/png"),
  );
}
