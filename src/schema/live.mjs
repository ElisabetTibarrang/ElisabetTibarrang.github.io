import { z } from "astro/zod";
import { articleSchema } from "./article.mjs";
import { researcherProfileSchema } from "./researcher-profile.mjs";
import { publicationSchema } from "./publications.mjs";

export const liveArticleSchema = articleSchema.extend({
  source: z.enum(["wordpress", "cloudflare-d1", "api"]).optional(),
  remoteId: z.string().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const liveProfileSchema = researcherProfileSchema.extend({
  source: z.enum(["wordpress", "cloudflare-d1", "api"]).optional(),
  remoteId: z.string().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const livePublicationSchema = publicationSchema.extend({
  source: z.enum(["wordpress", "cloudflare-d1", "api"]).optional(),
  remoteId: z.string().optional(),
  updatedAt: z.coerce.date().optional(),
});