---
feature: seo-and-schema
status: working
files:
  - src/components/seo/BaseHead.astro
  - src/utils/head.ts
  - src/types/HeadProps.ts
  - src/components/schema/JsonLd.astro
  - src/components/schema/ArticleSchema.astro
  - src/components/schema/WebPageSchema.astro
  - src/components/schema/OrganizationSchema.astro
  - src/components/schema/WebsiteSchema.astro
  - src/components/ui/Faq.astro
  - src/components/ui/Breadcrumb.astro
  - src/layouts/BaseLayout.astro
  - src/layouts/PageLayout.astro
  - src/layouts/ArticleLayout.astro
  - src/schema/base.mjs
verified: 2026-11-04 @ 355e3e9
---

# SEO head and structured data

Each page passes `headProps` to a layout; the layout fills defaults and renders `<head>` metadata and JSON-LD.

## What it does

- **`<head>`** (`BaseHead.astro`): title, favicon set, manifest, `theme-color`, `color-scheme`, canonical, description, keywords, author, Open Graph (`article` for article/publication/service/review types, else `website`), Twitter card, preloaded social image, RSS autodiscovery link.
- **Robots meta** (`index|noindex`, `follow|nofollow`, `noarchive`, `nosnippet`, `noimageindex`, `nocache`): emitted in production builds only, not in dev.
- **JSON-LD:** `Organization` and `WebSite` on every page; `WebPage` (typed) on pages and articles; `Article` on blog posts. `JsonLd.astro` drops empty values, escapes `<`, and adds the CSP nonce.
- **Microdata:** FAQ list as `FAQPage` plus optional speakable JSON (`Faq.astro`); breadcrumbs as `BreadcrumbList` (`Breadcrumb.astro`).

## Configure

| Where | What |
| --- | --- |
| `brand.mjs` | Site name, description, `siteUrl`, locale, keywords, default author, featured/OG image and size, social links, `organization` |
| Per page `headProps` | `title`, `description`, `canonicalUrl` (path or URL), `image`, `type`, `index`, dates, `keywords`, `authors` |
| `PageLayout` prop `pageType` | `WebPage`, `AboutPage`, `ContactPage`, `CollectionPage`, `SearchResultsPage`, `ProfilePage` |

`normalizeHeadProps()` (`src/utils/head.ts`) resolves missing values: canonical from the current path, image from the hero image then `featuredImage`, authors from `defaultAuthor`, keywords from `brand.keywords`.

## Common tasks

1. **New page:** wrap in `PageLayout` with `headProps = { title, description, canonicalUrl: "/x/", type, index }`.
2. **Change the default social image:** `featuredImage*` in `brand.mjs`, then `pnpm brand` if the asset changed.
3. **New schema type:** add `src/components/schema/<Name>Schema.astro` using `JsonLd`, include it from the layout that needs it.

## Verify

```bash
pnpm build
```

Then view source of `/` and a blog post: one `<title>`, one canonical, `og:*` tags, and `application/ld+json` blocks carrying a `nonce`. Paste the post URL into a structured-data validator for a final check.

## Gotchas

- Frontmatter `canonicalUrl` is ignored on blog posts (G19).
- `BreadcrumbSchema`, `CollectionSchema`, `PaginationSchema`, `SchemaLocalBusiness`, `SchemaSiteNavigation` exist but are not used (G5).
- Robots meta is absent in dev, so `noindex` checks need a production build.
- Organization data in `brand.mjs` is dummy (`Example Company`, `example.com`). Replace it, or blank the fields you do not want in the JSON-LD.

## Related

- [content-editing](content-editing.md) — frontmatter that feeds `headProps`
- [layouts-and-navigation](layouts-and-navigation.md) — which layout adds which schema
- [sitemap-rss-robots](sitemap-rss-robots.md) — crawl-level controls
- [security-headers](security-headers.md) — why inline JSON-LD needs a nonce
- [contact-form](contact-form.md) — `ContactPage` schema type
