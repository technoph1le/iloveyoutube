import express, { Router, type ErrorRequestHandler } from "express";
import { descriptionBuilderRoutes } from "./features/description-builder/routes.js";
import { imageRoutes } from "./features/images/routes.js";
import { thumbnailPreviewerRoutes } from "./features/thumbnail-previewer/routes.js";
import { videoRoutes } from "./features/videos/routes.js";

export const app = express();

app.disable("x-powered-by");
// Large enough for a two-hour transcript.
app.use(express.json({ limit: "512kb" }));

// Each feature owns its routes under /api; the frontend reaches them through
// its /api rewrite.
const api = Router();
api.get("/health", (_req, res) => {
  res.json({ ok: true });
});
api.use("/videos", videoRoutes);
api.use("/images", imageRoutes);
api.use("/thumbnail-previewer", thumbnailPreviewerRoutes);
api.use("/description-builder", descriptionBuilderRoutes);
app.use("/api", api);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Client mistakes such as malformed JSON or an oversized body.
  if (err.expose && err.status >= 400 && err.status < 500) {
    res.status(err.status).json({ error: err.status === 413 ? "That's too much text." : "Invalid request." });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
app.use(errorHandler);
