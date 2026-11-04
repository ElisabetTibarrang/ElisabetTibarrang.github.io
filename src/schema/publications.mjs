import { z } from "astro/zod";
import { seoSchema } from "./base.mjs";

export const publicationAuthorSchema = z.object({
  name: z.string().min(1),
  affiliation: z.string().optional(),
  corresponding: z.boolean().optional().default(false),
});

export const publicationSchema = seoSchema.extend({
  kind: z.literal("publication").optional(),

  publicationType: z
    .enum(["journal", "conference", "book", "chapter", "preprint", "patent", "report"])
    .optional()
    .default("journal"),

  authorsList: z.array(publicationAuthorSchema).optional().default([]),

  journal: z.string().optional(),
  publisher: z.string().optional(),
  year: z.number().or(z.string()).optional(),

  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),

  doi: z.string().optional(),
  externalUrl: z.string().optional(),
  pdfUrl: z.string().optional(),

  abstract: z.string().optional(),
  citation: z.string().optional(),

  researcherSlug: z.string().optional(),
});