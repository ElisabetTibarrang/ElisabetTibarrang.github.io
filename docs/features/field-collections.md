---
feature: field-collections
status: partial
files:
  - src/config/pages.mjs
  - src/utils/collections.mjs
  - src/pages/tags/index.astro
  - src/pages/tags/[tag]/index.astro
  - src/pages/categories/index.astro
  - src/pages/categories/[category]/index.astro
  - src/components/BlogCard.astro
  - scripts/generate-content-config.mjs
verified: 2026-11-04 @ 355e3e9
---

# Field collections (tags, categories, subjects…)

A field collection groups entries by a frontmatter list such as `tags` or `categories`. Tags and categories ship with archive pages; subjects, topics and fields are defined but off.

## What it does

- `/tags/` and `/categories/` list every value with a count; `/tags/<tag>/` and `/categories/<category>/` list the matching posts.
- Archive pages are prerendered and use `ArticleLayout` with `BlogCard`.
- An archive gets `noindex` when it has no entries.

## Configure (`fieldCollections` in `src/config/pages.mjs`)

| Option | Used today? | Meaning |
| --- | --- | --- |
| `enabled` | generator only | Whether `pnpm content_config` adds the field to schemas. Archive routes ignore it (G7) |
| `fieldName` | yes | Frontmatter key (`tags`) |
| `title`, `label`, `description` | partly | Headings and breadcrumbs |
| `collections` | generator | Limits the field to the listed collections (subjects, topics, fields) |
| `param`, `layout`, `meta`, `llms` | no | Reserved |
| `maxPerEntry`, `sitemapMinPosts` | no | Never enforced (G7, G3) |

Tags and categories are `enabled: true`; subjects, topics and fields are `enabled: false` and have no archive routes.

## How it works

`getFieldValueCounts("blog", "tags")` returns `{ value, count }` sorted by count then name; each value becomes a static path. `getEntriesByFieldValue` matches case-insensitively.

## Common tasks

**Add a new taxonomy (for example `series`):**

1. In `fieldCollections`, add `series: { enabled: true, fieldName: "series", title: "Series", collections: ["blog"], … }` (copy `tags`).
2. `pnpm content_config`. Posts can now use `series: [...]`.
3. Copy `src/pages/tags/` to `src/pages/series/`; change the field name and the `fieldCollections.series` references.
4. Add the archive URLs to `sitemap.xml.ts` (G3) and a nav link if wanted.

**Show tags on a post:** not rendered on the article page today (G1); add it in `src/pages/blog/[...slug].astro`.

## Verify

```bash
pnpm build      # prerender log shows /tags/<value>/ and /categories/<value>/ for every value in use
```

## Gotchas

- Values are route params verbatim: `Astro` and `astro` make two archives, spaces make awkward URLs (G14). Write lowercase-hyphenated values.
- Archives are not paginated (G7) and are missing from the sitemap (G3).
- The blog schema accepts only the field collections that are enabled in `pages.mjs` (tags, categories). A `subjects:` list in a post is silently dropped until you enable it and re-run `pnpm content_config`.

## Related

- [collections](collections.md) — `taxonomy` flags per collection
- [content-editing](content-editing.md) — using the fields in frontmatter
- [sitemap-rss-robots](sitemap-rss-robots.md) — archive pages are not listed
- [config-and-generators](config-and-generators.md) — `pnpm content_config`
