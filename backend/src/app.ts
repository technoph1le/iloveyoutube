import express, { Router, type ErrorRequestHandler } from "express";
import { imageRoutes } from "./features/images/routes.js";
import { thumbnailPreviewerRoutes } from "./features/thumbnail-previewer/routes.js";
import { videoRoutes } from "./features/videos/routes.js";

export const app = express();

app.disable("x-powered-by");
app.use(express.json());

// Each feature owns its routes under /api; the frontend reaches them through
// its /api rewrite.
const api = Router();
api.get("/health", (_req, res) => {
  res.json({ ok: true });
});
api.use("/videos", videoRoutes);
api.use("/images", imageRoutes);
api.use("/thumbnail-previewer", thumbnailPreviewerRoutes);
app.use("/api", api);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
app.use(errorHandler);
