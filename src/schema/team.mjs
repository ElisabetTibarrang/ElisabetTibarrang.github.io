import { z } from "astro/zod";

export const socialLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  icon: z.string().optional(),
});

export const teamSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),

  title: z.string().optional(),
  description: z.string().optional(),

  designation: z.string().optional(),
  affiliation: z.string().optional(),
  email: z.string().optional(),

  image: z.string().optional(),
  imageAlt: z.string().optional(),

  role: z.enum(["author", "team", "researcher", "alumni"]).optional().default("team"),

  bio: z.string().optional(),
  socials: z.array(socialLinkSchema).optional().default([]),

  draft: z.boolean().optional().default(false),
  index: z.boolean().optional().default(true),
});