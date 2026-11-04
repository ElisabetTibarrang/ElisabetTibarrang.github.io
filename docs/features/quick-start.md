---
feature: quick-start
status: working
files:
  - package.json
  - src/config/brand.mjs
  - src/config/colors.css
  - src/config/contact.mjs
  - src/config/wrangler.mjs
  - src/config/pages.mjs
  - src/pages/index.astro
  - src/assets/brand/favicon.svg
  - astro.config.mjs
  - src/content/blog/hello-world.mdx
  - public/images/featured.png
  - LICENSE
  - README.md
verified: 2026-11-04 @ 355e3e9
---

# Quick start (setup in 5 minutes)

Go from clone to a running, rebranded site. The template ships with dummy content: a placeholder brand, three example posts, one shared image and no real keys, IDs or URLs. Search a file for `EDIT` to find the values to change.

## The 5-minute path

```bash
git clone https://github.com/nviewsweb/astrowebtheme-free.git
cd astrowebtheme-free
pnpm install
pnpm dev        # http://localhost:4321
```

Requires Node >= 22.12 and pnpm 11. Then work through the checklist below.

## Rebrand checklist

| # | Change | File | Then run |
| --- | --- | --- | --- |
| 1 | `siteName`, `shortName`, `title`, `description`, `siteUrl`, `keywords`, `lang`, `locale` (`siteUrl` also feeds `site:` in Astro) | `src/config/brand.mjs` | |
| 2 | Logo: the header shows your `siteName` as text. Replace the favicon/app icon SVG | `src/assets/brand/favicon.svg` | `pnpm brand` |
| 3 | `themeColor`, `backgroundColor`, featured image alt/title/size | `src/config/brand.mjs` | `pnpm brand` |
| 4 | Replace the one shared image | `public/images/featured.png` | |
| 5 | Primary/secondary colours **and** `--filter-primary` / `--filter-secondary` | `src/config/colors.css` | `pnpm colors` |
| 6 | `contact`, `socialLinks` (`""` hides an icon), `defaultAuthor`, `incharge`, `organization` | `src/config/brand.mjs` | |
| 7 | Home page: a how-to-start guide with a call-us band. Rewrite the copy, keep or delete sections | `src/pages/index.astro`, `src/styles/pages/home-page.css` | |
| 8 | Which pages show in header/footer; page titles; what is on or off | `src/config/pages.mjs` | `pnpm content_config` if you enable a collection |
| 9 | Optional: turn the contact form on (`enabled`, handler URL, then `TENANT_ID` / `TENANT_API_TOKEN`) | [contact-form](contact-form.md) | `pnpm wrangler_json` |
| 10 | Worker name (`projectName`) | `src/config/wrangler.mjs` | `pnpm wrangler_json` |
| 11 | `name`, `homepage`, `repository`, `bugs`, `author` | `package.json` | |
| 12 | Copyright holder | `LICENSE` | |
| 13 | Replace or delete the three example posts | `src/content/blog/*.mdx` | |
| 14 | Rewrite About; review the Privacy, Cookie and Terms text and set `legal.updated` / `legal.governingLaw` | [legal-and-about-pages](legal-and-about-pages.md) | |
| 15 | Turn on only the analytics/ads you use, in **both** the feature config and `security.mjs` | [consent-analytics-ads](consent-analytics-ads.md) | |

## Verify

```bash
pnpm check    # expect 0 errors
pnpm build
```

Open `/`, `/blog/`, `/contact-us/`, `/sitemap.xml`, `/rss.xml`, `/llms.txt`, `/robots.txt` and confirm names and URLs are yours.

## Gotchas

- Every contact detail and address in `brand.mjs` is fictional (`example.com`). Phone and WhatsApp are empty. Social links point at each network's home page: replace each with your profile URL or set `""` to hide the icon.
- The favicon is a neutral purple sparkle until you replace `src/assets/brand/favicon.svg`. The shared image `public/images/featured.png` is a neutral purple landscape: replace it with your own.
- The footer credit and the About credits come from `src/config/credit.mjs`. Keep, change or hide them (`enabled: false`).
- `robots.txt` blocks all crawling outside production builds (`blockAllInNonProd`), so a staging site is never indexed.
- The contact form is off: `/contact-us/` shows only your contact cards until you turn it on.
- Git history still contains the previous owner's IDs and numbers; start your site from a fresh repository if that matters.
- There is no setup wizard and no `.env.example`; the only secrets are `TENANT_ID` and `TENANT_API_TOKEN`, written as placeholders to `.dev.vars` by `pnpm wrangler_json`.

## Related

- [config-and-generators](config-and-generators.md) — what each config file and command owns
- [content-editing](content-editing.md) — writing the first post
- [cloudflare-and-pwa](cloudflare-and-pwa.md) — deploying after rebrand
- [theme-and-styling](theme-and-styling.md) — colour tokens and the icon filters
- [home-page](home-page.md) — the starter home page and its help band
- [legal-and-about-pages](legal-and-about-pages.md) — About, Privacy, Cookie and Terms
- [contact-form](contact-form.md) — email handler setup and secrets
