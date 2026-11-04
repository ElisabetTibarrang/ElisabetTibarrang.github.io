---
feature: content-editing
status: partial
files:
  - src/content/blog/hello-world.mdx
  - public/images/featured.png
  - src/schema/base.mjs
  - src/schema/article.mjs
  - src/content.config.mjs
  - src/utils/collections.mjs
  - src/pages/blog/[...slug].astro
  - src/components/ui/Faq.astro
  - README.md
verified: 2026-11-04 @ 355e3e9
---

# Content editing

Posts live in `src/content/blog/` as `.md` or `.mdx`, separate from code. Frontmatter is validated by Zod, so a bad field fails the build instead of shipping.

## What it does

- One file per post; URL is `/blog/<slug>/` (trailing slash).
- Lists, RSS, `llms.txt`, sitemap and search read the same visible set: not `draft`, newest first by `publishedDate`, then `lastModified`.
- A post's `faq` renders an accordion (`Faq.astro`).
- Contractors can edit posts through GitHub collaborator access and pull requests; there is deliberately no CMS or API (see `README.md`).

## Frontmatter

| Field | Required | Notes |
| --- | --- | --- |
| `title`, `description` | yes | Non-empty strings |
| `slug` | no | Lowercase letters, digits, `-` and `/` only. Defaults to the file name |
| `publishedDate`, `lastModified` | no | `"2026-06-27"` style; coerced to dates. `lastModified` feeds sitemap `lastmod` |
| `draft` | no | `true` hides the post everywhere |
| `index` | no | `false` adds `noindex` (but see G17) |
| `featured` | no | Flag only |
| `keywords` | no | String list |
| `heroImage`, `heroImageAlt`, `heroImageTitle`, `heroImageCaption` | no | `heroImage` is a URL path served from `public/`. The three example posts all use `/images/featured.png` |
| `tags`, `categories` | no | String lists, default `[]`. `subjects` and `topics` are off, so the schema drops them |
| `faq` | no | `[{ question, answer, speakable }]` |
| `subtitle`, `summary`, `readingTime`, `difficulty` | no | Accepted, not rendered (G1) |
| `toc`, `related` | no | Accepted, not rendered (G1) |
| `authors` | no | `[{ id }]` refs to a team collection that does not exist in Free. Leave `[]`; `defaultAuthor` from `brand.mjs` is used |
| `canonicalUrl` | no | Accepted, ignored on blog posts (G19) |

## Common tasks

1. **New post:** copy `src/content/blog/hello-world.mdx`, change `title`, `description`, `slug`, dates; delete unused fields.
2. **Publish a draft:** set `draft: false` and update `lastModified`.
3. **Add a tag/category:** just use it in frontmatter, lowercase-hyphenated; archive pages appear on the next build ([field-collections](field-collections.md)).
4. **Remove the example posts:** delete the three files in `src/content/blog/`. Set `draft: true` to hide one without deleting it.

## Verify

```bash
pnpm build       # fails with the offending file and field if frontmatter is invalid
```

Then open `/blog/<slug>/` and `/blog/`.

## Gotchas

- Dates in frontmatter must be real dates; a post with no date uses the current time as its RSS `pubDate`.
- `index: false` does not remove the post from sitemap, RSS, `llms.txt` or search (G17).
- TOC, related posts, prev/next and reading time are not displayed even though the flags exist (G1).
- Do not add a hero image path that is not in `public/`; the page uses a plain `<img>` and will not optimise it.
- A broken `heroImage` path does not fail the build; open the post and check the image.

## Related

- [collections](collections.md) — how a collection and its URL are defined
- [field-collections](field-collections.md) — tags and categories
- [seo-and-schema](seo-and-schema.md) — what frontmatter becomes in `<head>` and JSON-LD
- [sitemap-rss-robots](sitemap-rss-robots.md), [llms-txt](llms-txt.md), [search](search.md) — where posts are listed
- [quick-start](quick-start.md) — replacing the example posts when rebranding
