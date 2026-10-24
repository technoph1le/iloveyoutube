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
