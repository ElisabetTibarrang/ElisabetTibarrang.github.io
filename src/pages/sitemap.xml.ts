// src/pages/sitemap.xml.ts
import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";

import { getVisibleCollection, getEntryUrl } from "@/utils/collections.mjs";
import { allPagesNormalized } from "@/config/pages.mjs";
import brandConfig from "@/config/brand.mjs";

type BlogEntry = CollectionEntry<"blog">;

function absoluteUrl(path: string): string {
  const base = String(brandConfig.siteUrl || "/").replace(/\/+$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function urlEntry(loc: string, lastmod?: string): string {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export const GET: APIRoute = async () => {
  const entries: string[] = [];

  entries.push(urlEntry(absoluteUrl("/")));
  entries.push(urlEntry(absoluteUrl("/blog/")));

  const blogEntries = (await getVisibleCollection("blog")) as BlogEntry[];

  for (const entry of blogEntries) {
    const lastmod =
      entry.data.lastModified || entry.data.publishedDate
        ? new Date(entry.data.lastModified || entry.data.publishedDate).toISOString()
        : undefined;

    entries.push(urlEntry(absoluteUrl(getEntryUrl("blog", entry)), lastmod));
  }

  for (const page of Object.values(allPagesNormalized)) {
    if (!page.enabled || !page.sitemap || !page.path) continue;
    entries.push(urlEntry(absoluteUrl(page.path)));
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
