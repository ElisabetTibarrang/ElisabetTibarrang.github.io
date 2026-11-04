---
feature: llms-txt
status: working
files:
  - src/pages/llms.txt.ts
  - src/pages/blog/llms.txt.ts
  - src/config/pages.mjs
  - src/config/brand.mjs
verified: 2026-11-04 @ 355e3e9
---

# llms.txt

Plain-text indexes that help AI agents and crawlers find your content.

## What it does

- `/llms.txt`: `# <siteName>`, the site description, `## Pages` (links to opted-in pages) and `## Blog` (every visible post as `- [title](url): description`).
- `/blog/llms.txt`: `# <siteName> - Blog`, the collection description and `## Articles`.
- Served as `text/plain; charset=utf-8`; prerendered at build time, so a new post appears after the next `pnpm build`.
- `robots.txt` mentions both files as comment lines.

## Configure

| Option | File | Effect |
| --- | --- | --- |
| `llms: "basic" \| "full" \| true` on a page | `src/config/pages.mjs` | Includes the page under `## Pages` (needs `enabled` and `path`) |
| `siteName`, `description` | `src/config/brand.mjs` | Heading and summary |
| `robots.llmsUrl`, `robots.extraLlms` | `src/config/brand.mjs` | What `robots.txt` advertises |

`features.llms` on a collection and `llms` on a field collection are **not read** by these endpoints.

## Common tasks

1. **Add a page:** set `llms: "basic"` on it in `pages.mjs`.
2. **Remove a page:** delete the flag or set `enabled: false`.
3. **Add another collection:** copy `src/pages/blog/llms.txt.ts` to `src/pages/<base>/llms.txt.ts`, replace `"blog"`, and add a section to `src/pages/llms.txt.ts` (G13).

## Verify

```bash
curl http://localhost:4321/llms.txt
curl http://localhost:4321/blog/llms.txt
```

Expect the site name on the first line and one line per non-draft post.

## Gotchas

- Links are site-relative (`/blog/slug/`), not absolute URLs.
- `basic` and `full` produce the same output (G15).
- Posts with `index: false` are still listed (G17).
- Only the blog is read (G13).

## Related

- [sitemap-rss-robots](sitemap-rss-robots.md) — sibling discovery endpoints
- [collections](collections.md) — how entries and URLs are resolved
- [content-editing](content-editing.md) — the description line comes from frontmatter
