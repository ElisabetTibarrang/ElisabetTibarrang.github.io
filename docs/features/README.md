# Feature index

Open **one** feature doc per task. Status meanings are in [../README.md](../README.md). Open problems are in [../known-gaps.md](../known-gaps.md).

## Features

| Feature | Status | Doc | Main source |
| --- | --- | --- | --- |
| Setup in 5 minutes and rebrand checklist | working | [quick-start](quick-start.md) | `src/config/brand.mjs` |
| Config files and generators | working | [config-and-generators](config-and-generators.md) | `src/config/*`, `scripts/*` |
| Content editing (posts, frontmatter) | partial | [content-editing](content-editing.md) | `src/content/`, `src/schema/` |
| Collections (collection-name and root URLs) | partial | [collections](collections.md) | `src/config/pages.mjs` |
| Field collections (tags, categories, subjects…) | partial | [field-collections](field-collections.md) | `fieldCollections` in `pages.mjs` |
| `llms.txt` | working | [llms-txt](llms-txt.md) | `src/pages/llms.txt.ts` |
| Sitemap, RSS, robots | partial | [sitemap-rss-robots](sitemap-rss-robots.md) | `src/pages/sitemap.xml.ts` |
| Security headers and CSP | working | [security-headers](security-headers.md) | `src/config/security.mjs`, `src/middleware.ts` |
| Home page (how-to-start guide, animated hero, help band) | working | [home-page](home-page.md) | `src/pages/index.astro`, `src/components/HeroOrbit.astro` |
| About, Privacy, Cookie and Terms pages (example text, credits) | working | [legal-and-about-pages](legal-and-about-pages.md) | `src/pages/about-us.astro`, `src/pages/privacy-policy.astro` |
| Contact form (email handler, 100 free submissions/month) | partial | [contact-form](contact-form.md) | `src/pages/api/contact.ts`, `src/config/contact.mjs` |
| SvgIcon (inline, sprite, local, external) | working | [svg-icons](svg-icons.md) | `src/components/svg/SvgIcon.astro` |
| SEO head and JSON-LD | working | [seo-and-schema](seo-and-schema.md) | `src/components/seo/BaseHead.astro` |
| Search | partial | [search](search.md) | `src/pages/search.astro` |
| Consent, analytics, ads | working | [consent-analytics-ads](consent-analytics-ads.md) | `src/config/consent.mjs` |
| Layouts, header/footer, pagination | partial | [layouts-and-navigation](layouts-and-navigation.md) | `src/layouts/*` |
| Theme, colours, CSS, fonts | working | [theme-and-styling](theme-and-styling.md) | `src/config/colors.css` |
| Cloudflare deploy, service worker, PWA | partial | [cloudflare-and-pwa](cloudflare-and-pwa.md) | `wrangler.jsonc`, `scripts/generate-sw.mjs` |
| Auth scaffold (Pro) | scaffold | [auth-scaffold](auth-scaffold.md) | `src/middleware.ts` |

## I want to…

| Task | Read |
| --- | --- |
| Start a new site from this theme | [quick-start](quick-start.md) → [config-and-generators](config-and-generators.md) |
| Write or edit a blog post | [content-editing](content-editing.md) |
| Add a new collection or page type | [collections](collections.md), then [sitemap-rss-robots](sitemap-rss-robots.md) and [llms-txt](llms-txt.md) |
| Add tags, categories or a new taxonomy | [field-collections](field-collections.md) |
| Add or change an icon | [svg-icons](svg-icons.md) |
| Add a third-party script or embed (CSP error) | [security-headers](security-headers.md), then [consent-analytics-ads](consent-analytics-ads.md) |
| Change colours, dark mode, fonts | [theme-and-styling](theme-and-styling.md) |
| Change the header, footer or nav links | [layouts-and-navigation](layouts-and-navigation.md) |
| Fix SEO metadata or structured data | [seo-and-schema](seo-and-schema.md) |
| Change the home page, hero animation or help band | [home-page](home-page.md) |
| Edit the About page, credits or the legal pages | [legal-and-about-pages](legal-and-about-pages.md) |
| Set up the contact form (handler URL and token) | [contact-form](contact-form.md) |
| Deploy or change Cloudflare bindings | [cloudflare-and-pwa](cloudflare-and-pwa.md) |
| Work out why something "exists but does nothing" | [../known-gaps.md](../known-gaps.md) |
