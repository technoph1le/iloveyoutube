import { Router } from "express";
import { getFeed } from "./feed-cache.js";

export const thumbnailPreviewerRoutes = Router();

// Trending videos for the thumbnail previewer, refreshed weekly.
thumbnailPreviewerRoutes.get("/feed", async (_req, res) => {
  try {
    // no-cache: browsers revalidate via ETag (cheap 304s), so a changed
    // response shape never gets stuck in their cache.
    res.set("Cache-Control", "no-cache");
    res.json(await getFeed());
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: "The video feed is unavailable right now." });
  }
});
