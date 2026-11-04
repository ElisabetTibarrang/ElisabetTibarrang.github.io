// src/utils/collections.mjs
import { getCollection } from "astro:content";
import { collections as pageCollections } from "@/config/pages.mjs";

export function getEntrySlug(entry) {
  return entry?.data?.slug || entry?.id || "";
}

export function getCollectionBase(collectionKey) {
  return String(pageCollections?.[collectionKey]?.base ?? collectionKey).replace(/^\/|\/$/g, "");
}

export function getEntryUrl(collectionKey, entry) {
  const base = getCollectionBase(collectionKey);
  const slug = getEntrySlug(entry);
  return base ? `/${base}/${slug}/` : `/${slug}/`;
}

export async function getVisibleCollection(collectionKey) {
  const entries = await getCollection(collectionKey);

  return entries
    .filter((entry) => entry?.data?.draft !== true)
    .filter((entry) => !getEntrySlug(entry).startsWith("0-example-"))
    .sort((a, b) => {
      const ad = new Date(a.data.publishedDate || a.data.lastModified || 0).valueOf();
      const bd = new Date(b.data.publishedDate || b.data.lastModified || 0).valueOf();
      return bd - ad;
    });
}

export async function getFieldValueCounts(collectionKey, fieldName) {
  const entries = await getVisibleCollection(collectionKey);
  const counts = new Map();

  for (const entry of entries) {
    const values = Array.isArray(entry.data?.[fieldName]) ? entry.data[fieldName] : [];

    for (const raw of values) {
      const value = String(raw || "").trim();
      if (!value) continue;
      counts.set(value, (counts.get(value) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

export async function getEntriesByFieldValue(collectionKey, fieldName, value) {
  const entries = await getVisibleCollection(collectionKey);
  const needle = String(value || "").trim().toLowerCase();

  return entries.filter((entry) => {
    const values = Array.isArray(entry.data?.[fieldName]) ? entry.data[fieldName] : [];
    return values.some((v) => String(v).trim().toLowerCase() === needle);
  });
}

export async function getEntryBySlug(collectionKey, slug) {
  const entries = await getVisibleCollection(collectionKey);
  const needle = String(slug || "").trim().toLowerCase();

  return entries.find((entry) => getEntrySlug(entry).toLowerCase() === needle) || null;
}