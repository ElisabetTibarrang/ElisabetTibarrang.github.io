import { z } from "astro/zod";

export const reviewSchema = z.object({
  name: z.string().min(1),
  title: z.string().optional(),
  company: z.string().optional(),

  rating: z.number().min(1).max(5).optional(),
  review: z.string().min(1),

  image: z.string().optional(),
  date: z.coerce.date().optional(),

  featured: z.boolean().optional().default(false),
  draft: z.boolean().optional().default(false),
});