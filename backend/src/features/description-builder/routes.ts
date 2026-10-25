import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { env } from "../../env.js";
import { clientIp, createLimiter } from "../../lib/rate-limit.js";
import { AiError, aiAvailable, generate } from "./ai.js";
import { estimateTimes, estimatedDuration, formatTime, parseTranscript } from "./transcript.js";

// About two hours of speech.
const MAX_TRANSCRIPT = 150_000;
const MIN_CHAPTERS_DURATION = 120;

const perVisitor = createLimiter({ windowMs: 60 * 60 * 1000, max: env.AI_HOURLY_LIMIT });
const siteWide = createLimiter({ windowMs: 24 * 60 * 60 * 1000, max: env.AI_DAILY_LIMIT });

// Counts one AI request, or answers with why it can't run and returns false.
function allow(req: Request, res: Response) {
  if (!aiAvailable) {
    res.status(503).json({ error: "AI features aren't set up on this server." });
    return false;
  }
  const visitor = perVisitor.take(clientIp(req));
  if (!visitor.ok) {
    res.set("Retry-After", String(visitor.retryAfterSeconds));
    res.status(429).json({
      error: `You've reached the limit of ${env.AI_HOURLY_LIMIT} AI requests an hour. Try again in ${Math.ceil(visitor.retryAfterSeconds / 60)} minutes.`,
    });
    return false;
  }
  const site = siteWide.take("site");
  if (!site.ok) {
    res.set("Retry-After", String(site.retryAfterSeconds));
    res.status(429).json({ error: "The AI features have reached today's limit. Please try again tomorrow." });
    return false;
  }
  return true;
}

function fail(res: Response, err: unknown) {
  if (err instanceof AiError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
}

const GenerateBody = z.object({
  transcript: z
    .string({ error: "Paste a transcript first." })
    .trim()
    .min(200, "That transcript is too short. Paste the full transcript of your video.")
    .max(MAX_TRANSCRIPT, `Transcripts can be up to ${MAX_TRANSCRIPT.toLocaleString("en-US")} characters.`),
});

export const descriptionBuilderRoutes = Router();

descriptionBuilderRoutes.get("/status", (_req, res) => {
  res.json({ ai: aiAvailable, hourlyLimit: env.AI_HOURLY_LIMIT });
});

// Title, description, chapters (when the transcript has timestamps) and
// hashtags from one transcript, in a single AI request.
descriptionBuilderRoutes.post("/generate", async (req, res) => {
  const body = GenerateBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.issues[0].message });
    return;
  }
  const { transcript } = body.data;
  const parsed = parseTranscript(transcript);
  // A few stray times in plain text don't make a timed transcript.
  const timed = parsed.length >= 3 && parsed[parsed.length - 1].seconds >= 30;
  const duration = timed ? parsed[parsed.length - 1].seconds : estimatedDuration(transcript);
  // Short videos don't need chapters. Without timestamps, times are estimated
  // from the transcript's length, for the creator to adjust.
  const chapterMode = duration < MIN_CHAPTERS_DURATION ? "short" : timed ? "timed" : "estimated";
  const lines = chapterMode === "timed" ? parsed : chapterMode === "estimated" ? estimateTimes(transcript) : null;
  if (!allow(req, res)) return;
  try {
    const result = await generate(transcript, lines);
    res.json({
      ...result,
      chapters: result.chapters.map((c) => ({ time: formatTime(c.seconds), title: c.title })),
      chapterMode,
    });
  } catch (err) {
    fail(res, err);
  }
});
