import { Router } from "express";
import {
  FORMATS,
  getVideoInfo,
  SIZES,
  thumbnailUrl,
  VIDEO_ID,
  type Format,
  type Size,
} from "./video-info.js";

// Shared by the thumbnail downloader and the embed code generator.
export const videoRoutes = Router();

// Title, channel and which thumbnail sizes exist.
videoRoutes.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!VIDEO_ID.test(id)) {
    res.status(400).json({ error: "Invalid video id" });
    return;
  }
  try {
    const info = await getVideoInfo(id);
    if (!info) {
      res.status(404).json({ error: "Video not found or not public" });
      return;
    }
    res.set("Cache-Control", "no-cache");
    res.json(info);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Couldn't reach YouTube" });
  }
});

// A thumbnail served from our own domain: for display (so visitors' browsers
// never contact Google) or, with ?download=1, as a file with a readable name.
videoRoutes.get("/:id/thumbnails/:size.:format", async (req, res) => {
  const { id, size, format } = req.params;
  if (
    !VIDEO_ID.test(id) ||
    !(SIZES as readonly string[]).includes(size) ||
    !(FORMATS as readonly string[]).includes(format)
  ) {
    res.status(400).json({ error: "Invalid thumbnail" });
    return;
  }
  const upstream = await fetch(thumbnailUrl(id, size as Size, format as Format), {
    signal: AbortSignal.timeout(10000),
  });
  if (!upstream.ok) {
    res.status(upstream.status === 404 ? 404 : 502).json({ error: "Thumbnail not available" });
    return;
  }
  res.set({
    "Content-Type": format === "webp" ? "image/webp" : "image/jpeg",
    "Cache-Control": "public, max-age=86400",
  });
  if (req.query.download) {
    const name = String(req.query.name ?? id).replace(/[^a-z0-9-]/gi, "").slice(0, 80) || id;
    res.set("Content-Disposition", `attachment; filename="${name}.${format}"`);
  }
  res.send(Buffer.from(await upstream.arrayBuffer()));
});
