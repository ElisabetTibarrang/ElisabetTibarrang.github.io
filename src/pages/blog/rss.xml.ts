// src/pages/blog/rss.xml.ts
import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";

import rss from "@astrojs/rss";

import { getVisibleCollection, getEntryUrl } from "@/utils/collections.mjs";
import { collections } from "@/config/pages.mjs";
import brandConfig from "@/config/brand.mjs";

type BlogEntry = CollectionEntry<"blog">;

export const GET: APIRoute = async () => {
  const cfg = collections.blog;
  const entries = (await getVisibleCollection("blog")) as BlogEntry[];

  return rss({
    title: `${brandConfig.siteName || "Site"} - ${cfg.title}`,
    description: cfg.description || "",
    site: brandConfig.siteUrl,
    items: entries.map((entry: BlogEntry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate:
        entry.data.publishedDate ||
        entry.data.lastModified ||
        new Date(),
      link: getEntryUrl("blog", entry),
    })),
  });
};