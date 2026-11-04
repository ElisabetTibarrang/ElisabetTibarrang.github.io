// src/schema/base.mjs
import { z } from "astro/zod";

/* -------------------------------------------------------------------------- */
/* Base field schemas                                                         */
/* -------------------------------------------------------------------------- */

export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/);

export const dateSchema = z.coerce.date();

export const teamMemberRefSchema = z.object({
  id: z.string().min(1),
});

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  speakable: z.boolean().optional().default(false),
});

export const imageItemSchema = z.object({
  src: z.string().min(1),
  alt: z.string().optional(),
  title: z.string().optional(),
  caption: z.string().optional(),
});

export const downloadItemSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
  type: z.string().optional(),
  size: z.string().optional(),
});

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  slug: slugSchema.optional(),

  canonicalUrl: z.union([
    z.url(),
    z.string().startsWith("/")
  ]).optional(),

  index: z.boolean().optional().default(true),
  draft: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),

  publishedDate: dateSchema.optional(),
  lastModified: dateSchema.optional(),

  keywords: z.array(z.string()).optional().default([]),

  heroImage: z.string().optional(),
  heroImageAlt: z.string().optional(),
  heroImageTitle: z.string().optional(),
  heroImageCaption: z.string().optional(),
});

/* -------------------------------------------------------------------------- */
/* Dynamic schema extender from pages.mjs                                     */
/* -------------------------------------------------------------------------- */

export function extendSchema(baseSchema, options = {}) {
  const extra = {};

  const taxonomy = options.taxonomy || {};
  for (const [fieldName, enabled] of Object.entries(taxonomy)) {
    if (enabled === true) {
      extra[fieldName] = z.array(z.string()).optional().default([]);
    }
  }

  const relations = options.relations || {};

  if (relations.team === true || options.authors === true) {
    extra.authors = z.array(teamMemberRefSchema).optional().default([]);
  }

  if (relations.related === true) {
    extra.related = z.array(z.string()).optional().default([]);
  }

  if (relations.parent === true) {
    extra.parent = z.string().optional();
  }

  const assets = options.assets || {};

  if (assets.gallery === true) {
    extra.gallery = z.array(imageItemSchema).optional().default([]);
  }

  if (assets.downloads === true) {
    extra.downloads = z.array(downloadItemSchema).optional().default([]);
  }

  if (assets.attachments === true) {
    extra.attachments = z.array(downloadItemSchema).optional().default([]);
  }

  const features = options.features || {};

  if (features.faq === true) {
    extra.faq = z.array(faqItemSchema).optional().default([]);
  }

  if (features.toc === true) {
    extra.toc = z.boolean().optional().default(true);
  }

  return Object.keys(extra).length ? baseSchema.extend(extra) : baseSchema;
}