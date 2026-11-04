import { z } from "astro/zod";
import { articleSchema } from "./article.mjs";

export const serviceOfferSchema = z.object({
  priceKey: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
});

export const serviceSchema = articleSchema.extend({
  kind: z.literal("serviceArticle").optional(),

  serviceType: z.string().optional(),
  offers: z.array(serviceOfferSchema).optional().default([]),

  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
});