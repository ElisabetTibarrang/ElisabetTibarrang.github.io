// src/schema/article.mjs
import { z } from "astro/zod";
import {
  seoSchema,
  faqItemSchema,
  teamMemberRefSchema,
} from "./base.mjs";

export const articleSchema = seoSchema.extend({
  kind: z.literal("article").optional(),

  subtitle: z.string().optional(),
  summary: z.string().optional(),

  readingTime: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),

  authors: z.array(teamMemberRefSchema).optional().default([]),
  related: z.array(z.string()).optional().default([]),
  faq: z.array(faqItemSchema).optional().default([]),

  toc: z.boolean().optional().default(true),
});