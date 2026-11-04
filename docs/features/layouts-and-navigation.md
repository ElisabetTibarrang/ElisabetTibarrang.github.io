---
feature: layouts-and-navigation
status: partial
files:
  - src/layouts/BaseLayout.astro
  - src/layouts/PageLayout.astro
  - src/layouts/ArticleLayout.astro
  - src/layouts/CollectionLayout.astro
  - src/components/header/Header.astro
  - src/components/header/HeaderDefault.astro
  - src/components/header/Logo.astro
  - src/components/header/HeaderMinimal.astro
  - src/components/footer/Footer.astro
  - src/components/footer/FooterDefault.astro
  - src/components/Pagination.astro
  - src/components/ui/Breadcrumb.astro
  - src/components/BlogCard.astro
  - src/pages/blog/index.astro
verified: 2026-11-04 @ 355e3e9
---

# Layouts, header/footer, navigation and pagination

Page shells and site chrome. Navigation is partly built from `pages.mjs` and partly hard-coded.

## What it does

- **`BaseLayout`** wraps everything: `<head>` (BaseHead, fonts, inline base CSS, analytics and AdSense heads), header, `<main class="site-main site-main-<variant>">`, footer, consent banner and loaders, plus Organization and WebSite JSON-LD.
- **`PageLayout`** = BaseLayout + typed `WebPage` JSON-LD. **`ArticleLayout`** = BaseLayout + `WebPage` + `Article` JSON-LD.
- Layout props: `headProps`, `lang`, `theme` (`light` | `dark` | `auto`), `headerVariant` and `footerVariant` (`default` | `minimal` | `none`), `mainVariant` (`default` | `article` | `wide` | `blank`), and `pageType` on `PageLayout`.
- **Logo:** `src/components/header/Logo.astro` is a text logo: `brandConfig.siteName` in bold type (`src/styles/components/logo.css`), used by both headers and footers. There is no image logo; to add one, put an `<img>` in `Logo.astro`.
- **Header (default):** Home and Blog (hard-coded), then pages with `showInHeaderNav: true` (About and Contact; search is excluded), a search icon button, theme toggle, mobile menu, and a "Get Started" button linking to the contact page. **Minimal** header is available.
- **Footer (default):** pages with `showInFooterNav: true`, social links, legal links, and a credit line "Built with AstroWebTheme Free" from `credit.mjs` (set `enabled: false` to hide it). Social links set to `"#"` in `brand.mjs` render as local placeholder links; `""` hides the icon.
- **Pagination:** `Pagination.astro` takes `page = { currentPage, lastPage, url: { prev, next, current } }` and renders nothing when `lastPage <= 1`. Used by `/blog/` and `/blog/page/N/`; page size is `collections.blog.pagination.pageSize` (12).
- **Breadcrumb** renders `BreadcrumbList` microdata; **BlogCard** is the post card.

## Common tasks

1. **Add a page:** create `src/pages/<name>.astro` using `PageLayout`; add an entry to `pages` in `pages.mjs` (`path`, `location`, flags); set `showInHeaderNav` / `showInFooterNav` to show it.
2. **Change nav labels, CTA text or the hard-coded Home/Blog links:** edit `HeaderDefault.astro` (`staticNavItems`, `cta`).
3. **Use a different chrome on one page:** pass `headerVariant="minimal"` or `"none"`.
4. **Paginate another list:** build `page` like `blog/index.astro` does and render `<Pagination page={page} />`.

## Verify

`pnpm dev`, then check the header and footer links on `/` and on a page whose flags you changed. Resize to a narrow width to test the mobile menu.

## Gotchas

- Links to collections are hard-coded in the header (G13).
- `CollectionLayout`, `ServiceLayout` and `CvLayout` are empty files (G6); `BlockQuote` and `ShareLinks` are unused.
- The article page links to its tags and categories and back to the blog, but shows no table of contents, related posts, prev/next or share links (G1).
- Tag/category archives are not paginated (G7).
- `theme` defaults to `light`; the visitor's toggle then overrides `data-theme` ([theme-and-styling](theme-and-styling.md)).

## Related

- [seo-and-schema](seo-and-schema.md) — head and JSON-LD added by the layouts
- [consent-analytics-ads](consent-analytics-ads.md) — components mounted in `BaseLayout`
- [theme-and-styling](theme-and-styling.md) — theme toggle and CSS
- [collections](collections.md) — pagination settings per collection
- [svg-icons](svg-icons.md) — header icons
- [home-page](home-page.md) — a page built on `PageLayout`
- [legal-and-about-pages](legal-and-about-pages.md) — the footer legal links and the About credits
- [search](search.md) — the header search button and `/search/`
