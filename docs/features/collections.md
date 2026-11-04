---
feature: collections
status: partial
files:
  - src/config/pages.mjs
  - src/config/live.mjs
  - src/config/constants.mjs
  - src/utils/collections.mjs
  - src/content.config.mjs
  - src/live.config.mjs
  - src/loaders/live.mjs
  - scripts/generate-content-config.mjs
  - src/pages/blog/index.astro
  - src/pages/blog/page/[page].astro
  - src/pages/blog/[...slug].astro
verified: 2026-11-04 @ 355e3e9
---

# Collections

A collection is a content type (blog, docs, services…) declared once in `src/config/pages.mjs`. Only **blog** is enabled and routed in the Free theme; the other definitions are ready-made but disabled.

## What it does

- Declares URL base, content folder, schema kind, routing, pagination, taxonomy, features and layouts per collection.
- `pnpm content_config` turns enabled static collections into `src/content.config.mjs` (a Zod schema per collection, chosen by `kind`).
- Collection-name URLs work for blog: `/blog/`, `/blog/page/2/`, `/blog/<slug>/`.
- Root-level URLs (`/<slug>/`) are modelled but not served (G2).

## Configure (one entry in `collections`)

| Key | Meaning |
| --- | --- |
| `enabled` | `false` excludes it from the generated content config |
| `base` | URL segment. `"blog"` → `/blog/<slug>/`. `""` → `/<slug>/` (root level) |
| `dir` / `source.contentDir` | Folder under `src/content/` |
| `source.mode` | `static` (md/mdx), `static-data` (JSON), `live` (runtime loader) |
| `kind`, `contentType`, `entityType` | Schema choice, internal type, schema.org type (values in `constants.mjs`) |
| `routing`, `pagination` | `hasIndex`, `hasDetail`, `prerender`; page size (default 12) |
| `taxonomy`, `features`, `relations`, `assets` | Which fields and features apply |
| `layout` | `list`, `detail`, `card`, `schema` keys |

`src/config/live.mjs` holds two optional live collections (D1, WordPress). The loader in `src/loaders/live.mjs` is a stub that returns no entries.

## How it works

`getVisibleCollection(key)` (in `src/utils/collections.mjs`) loads a collection, drops drafts and `0-example-*` slugs, and sorts newest first. `getEntryUrl(key, entry)` builds the URL from `base` and the slug. Always use these two helpers.

## Common tasks

**Add a collection that is actually served** (enabling it is not enough, see G13):

1. Copy the `blog` entry in `pages.mjs`; set `enabled: true`, `base`, `dir`, `source: staticSource("<dir>")`.
2. Create `src/content/<dir>/` with a first entry.
3. `pnpm content_config`, then check the diff of `src/content.config.mjs`: only the collection you changed should differ.
4. Copy `src/pages/blog/index.astro`, `blog/page/[page].astro` and `blog/[...slug].astro` to `src/pages/<base>/`; change `"blog"` to your key.
5. Wire the blog-only endpoints: `sitemap.xml.ts`, add `<base>/rss.xml.ts` and `<base>/llms.txt.ts`, the index in `search.astro`, a link in `HeaderDefault.astro` (`staticNavItems`).
6. Add a feature doc from the template and a row in [README](README.md).

**Serve a collection at the root:** needs a catch-all `src/pages/[...slug].astro` that resolves only root-level collections and does not shadow real pages (G2).

## Verify

```bash
pnpm content_config && git diff src/content.config.mjs
pnpm build      # the prerender log lists every generated route
```

## Gotchas

- The comments in `pages.mjs` ("flip to true and add content") describe the schema step only (G13).
- `getCollection("doc")` throws for a collection that is disabled or missing from `content.config.mjs`.
- Most `layout` keys point at layouts that are empty or absent (`CollectionLayout`, `ServiceLayout`, G6).
- `scripts/generate-content-all.mjs` and `scripts/generate-live-config.mjs` are stale (G8).

## Related

- [field-collections](field-collections.md) — tags and categories across collections
- [content-editing](content-editing.md) — writing entries
- [sitemap-rss-robots](sitemap-rss-robots.md), [llms-txt](llms-txt.md), [search](search.md) — the blog-only endpoints
- [config-and-generators](config-and-generators.md) — `pnpm content_config`
- [layouts-and-navigation](layouts-and-navigation.md) — layout keys and the nav
- [auth-scaffold](auth-scaffold.md) — Pro middleware routes share names with the disabled collections
