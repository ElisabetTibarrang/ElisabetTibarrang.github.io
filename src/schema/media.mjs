import { z } from "astro/zod";
import { articleSchema } from "./article.mjs";

export const mediaBaseSchema = articleSchema.extend({
  duration: z.string().optional(),
  transcript: z.string().optional(),
  embedUrl: z.string().optional(),
  sourceUrl: z.string().optional(),
  thumbnail: z.string().optional(),
});

export const videoSchema = mediaBaseSchema.extend({
  kind: z.literal("mediaVideo").optional(),
  videoUrl: z.string().optional(),
});

export const audioSchema = mediaBaseSchema.extend({
  kind: z.literal("mediaAudio").optional(),
  audioUrl: z.string().optional(),
});