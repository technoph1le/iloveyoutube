import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(4000),

  // YouTube Data API v3 key (Google Cloud console). Optional so the server
  // starts without it; the thumbnail previewer feed reports it as missing.
  YOUTUBE_API_KEY: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined),
  YOUTUBE_REGION: z.string().length(2).default("US"),

  // Anthropic API key (console.anthropic.com). Optional; without it the AI
  // features of the description builder report themselves as unavailable.
  ANTHROPIC_API_KEY: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined),
  // AI requests allowed per visitor per hour, and for the whole site per day.
  // The daily cap bounds the bill even if per-visitor limits are evaded.
  AI_HOURLY_LIMIT: z.coerce.number().int().positive().default(10),
  AI_DAILY_LIMIT: z.coerce.number().int().positive().default(500),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables (see backend/.env.example):");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
