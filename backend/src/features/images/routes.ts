import { Router } from "express";

// Serves YouTube images (feed thumbnails, channel avatars) from our own
// domain, so visitors' browsers never connect to Google just by opening a
// page (GDPR: no IP address shared with a third party without consent).
// Only YouTube's image hosts are allowed, so this can't be used as an open proxy.
const ALLOWED_HOSTS = new Set(["i.ytimg.com", "yt3.ggpht.com", "yt3.googleusercontent.com"]);
const MAX_BYTES = 5 * 1024 * 1024;

export const imageRoutes = Router();

imageRoutes.get("/", async (req, res) => {
  let url: URL;
  try {
    url = new URL(String(req.query.url ?? ""));
  } catch {
    res.status(400).json({ error: "Invalid image URL" });
    return;
  }
  if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) {
    res.status(400).json({ error: "Image host not allowed" });
    return;
  }

  const upstream = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const type = upstream.headers.get("content-type") ?? "";
  const length = Number(upstream.headers.get("content-length") ?? 0);
  if (!upstream.ok || !type.startsWith("image/") || length > MAX_BYTES) {
    res.status(upstream.status === 404 ? 404 : 502).json({ error: "Image not available" });
    return;
  }
  const body = Buffer.from(await upstream.arrayBuffer());
  if (body.length > MAX_BYTES) {
    res.status(502).json({ error: "Image too large" });
    return;
  }
  res.set({ "Content-Type": type, "Cache-Control": "public, max-age=86400" });
  res.send(body);
});
