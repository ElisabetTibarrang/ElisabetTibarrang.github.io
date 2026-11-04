---
feature: sitemap-rss-robots
status: partial
files:
  - src/pages/sitemap.xml.ts
  - src/pages/rss.xml.ts
  - src/pages/blog/rss.xml.ts
  - src/pages/robots.txt.ts
  - src/config/brand.mjs
  - src/config/pages.mjs
  - src/components/seo/BaseHead.astro
verified: 2026-11-04 @ 355e3e9
---

# Sitemap, RSS and robots.txt

Three discovery endpoints, all prerendered at build time from config and content.

## What it does

- **`/sitemap.xml`**: `/`, `/blog/`, every visible post (with `lastmod`), and each page in `pages.mjs` with `enabled`, `sitemap` and a `path`. Absolute URLs from `siteUrl`. No `changefreq` or `priority`.
- **`/rss.xml`** and **`/blog/rss.xml`**: blog items with title, description, `pubDate`, link (via `@astrojs/rss`). Both feeds contain the blog only. `BaseHead` adds the `rel="alternate"` autodiscovery link when `brandConfig.rss` is true.
- **`/robots.txt`**: outside production it is `Disallow: /` for everyone (`blockAllInNonProd`). In production it lists `disallow` paths, optionally blocks AI crawlers, and adds `Sitemap:` lines. RSS and `llms.txt` URLs appear as `#` comments, not directives.

## Configure

| Option | File | Effect |
| --- | --- | --- |
| `sitemap: false` on a page | `src/config/pages.mjs` | Leaves that page out of the sitemap |
| `index: false` on a page | `src/config/pages.mjs` | Also drops it from the sitemap (when `sitemap` is not set) |
| `rss`, `rssUrl` | `src/config/brand.mjs` | Autodiscovery link in `<head>` |
| `robots.blockAICrawlers` | `src/config/brand.mjs` | Blocks GPTBot, ClaudeBot, CCBot, PerplexityBot, Google-Extended, Applebot-Extended, FacebookBot, anthropic-ai |
| `robots.disallow`, `extraSitemaps`, `extraRss`, `extraLlms`, `sitemapUrl`, `rssUrl`, `llmsUrl` | `src/config/brand.mjs` | robots.txt content |

## Common tasks

1. **Keep a page out of search:** `index: false` and `sitemap: false` in `pages.mjs`.
2. **Block AI crawlers:** `robots.blockAICrawlers: true`.
3. **Add tag/category archives to the sitemap (G3):** in `sitemap.xml.ts`, loop `getFieldValueCounts("blog", "tags")` and push `/tags/<value>/` (same for categories).
4. **Add another collection (G13):** loop `getVisibleCollection("<key>")` in `sitemap.xml.ts`; add `src/pages/<base>/rss.xml.ts`.

## Verify

```bash
curl http://localhost:4321/sitemap.xml
curl http://localhost:4321/rss.xml
curl http://localhost:4321/robots.txt     # dev shows "Disallow: /" by design
```

## Gotchas

- Tag/category archives and blog pagination pages are not in the sitemap (G3). `@astrojs/sitemap` is installed but unused.
- Posts with `index: false` are still in sitemap and RSS (G17).
- A post without dates gets `new Date()` as `pubDate`, so feed readers see it as new on every request.
- Only the blog is read (G13).

## Related

- [llms-txt](llms-txt.md) — the third discovery endpoint
- [collections](collections.md) — URL building
- [field-collections](field-collections.md) — the archives missing from the sitemap
- [seo-and-schema](seo-and-schema.md) — the `<head>` autodiscovery and robots meta
- [content-editing](content-editing.md) — dates and flags that feed these endpoints
