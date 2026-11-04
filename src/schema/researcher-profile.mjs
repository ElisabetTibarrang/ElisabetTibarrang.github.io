import { z } from "astro/zod";
import { seoSchema } from "./base.mjs";
import { socialLinkSchema } from "./team.mjs";

export const researcherProfileSchema = seoSchema.extend({
  kind: z.literal("researcherProfile").optional(),

  name: z.string().min(1),
  designation: z.string().optional(),
  affiliation: z.string().optional(),
  department: z.string().optional(),

  email: z.string().optional(),
  phone: z.string().optional(),

  image: z.string().optional(),
  imageAlt: z.string().optional(),

  biography: z.string().optional(),
  researchInterests: z.array(z.string()).optional().default([]),

  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.string().optional(),
      details: z.string().optional(),
    })
  ).optional().default([]),

  experience: z.array(
    z.object({
      title: z.string(),
      organization: z.string(),
      start: z.string().optional(),
      end: z.string().optional(),
      details: z.string().optional(),
    })
  ).optional().default([]),

  socials: z.array(socialLinkSchema).optional().default([]),
});