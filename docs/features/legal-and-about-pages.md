---
feature: legal-and-about-pages
status: working
files:
  - src/pages/about-us.astro
  - src/pages/privacy-policy.astro
  - src/pages/cookie-policy.astro
  - src/pages/terms.astro
  - src/styles/pages/about.css
  - src/styles/pages/legal.css
  - src/config/brand.mjs
  - src/config/credit.mjs
  - src/config/pages.mjs
verified: 2026-11-04 @ 355e3e9
---

# About, Privacy, Cookie and Terms pages

Example pages with real, readable text. Replace the wording with your own before you publish.

## What it does

- **About** (`/about-us/`, in the header and footer): story, what we do, values, the person from `brandConfig.incharge`, quick facts from `brandConfig.organization`, a call to action and a **Credits** section. Credits list AstroWebTheme Free (name, link and author from `credit.mjs`), Astro, Cloudflare Workers and the Inter typeface. A small note says the text is an example.
- **Privacy Policy**, **Cookie Policy**, **Terms & Conditions** (`/privacy-policy/`, `/cookie-policy/`, `/terms/`, in the footer): numbered sections in plain language, each starting with a notice that it is example text and not legal advice.
- The text uses your settings: company name, address and email from `brand.mjs`; `legal.updated` (date shown at the top) and `legal.governingLaw` (used in the terms).
- **The cookie and privacy pages follow the consent config.** The cookie table always lists the theme preference; it adds the `site_consent` cookie, analytics and advertising rows only when `consent-needed.mjs` says a vendor needs consent. With none on, the page says so.
- The refund page is off by default (`pages.mjs`), see [layouts-and-navigation](layouts-and-navigation.md).

## Configure

| What | Where |
| --- | --- |
| Company name, address, email, founder, founding year | `src/config/brand.mjs` (`organization`, `incharge`, `contact`) |
| Date shown on the policies, governing law | `src/config/brand.mjs` `legal` |
| Footer and About credit (name, link, author, on/off) | `src/config/credit.mjs` |
| Which of these pages appear in the header or footer | `src/config/pages.mjs` (`showInHeaderNav`, `showInFooterNav`, `enabled`) |
| Wording | the four `.astro` files |
| Look | `about.css`, `legal.css` |

## Common tasks

1. **Write your own About page:** replace the constants (`services`, `values`) and paragraphs in `about-us.astro`. Delete a section by removing its `<section>`.
2. **Add a vendor (for example GA4):** enable it in `analytics.mjs` and `security.mjs`. The cookie and privacy pages pick it up; add the real provider name and cookie names to the text.
3. **Hide the credit line in the footer:** `enabled: false` in `credit.mjs`. The About credits stay; remove that section by hand if you want it gone too.
4. **Add another legal page** (for example refunds): copy `terms.astro`, add an entry in `pages.mjs` with `showInFooterNav: true` and add its key to `legalPageKeys` in `FooterDefault.astro`.

## Verify

```bash
pnpm build
```

Open `/about-us/`, `/privacy-policy/`, `/cookie-policy/` and `/terms/`. Check that each is linked from the footer and that no link on the site goes to a missing page.

## Gotchas

- The text is generic and not legal advice. A real policy depends on your business, data and country.
- `legal.updated` is a plain string: update it by hand when you change a policy.
- Social links set to `"#"` stay on the page. A `target="_blank"` is added only to real `https://` links.

## Related

- [quick-start](quick-start.md) — the rebrand checklist
- [consent-analytics-ads](consent-analytics-ads.md) — what the cookie policy reflects
- [layouts-and-navigation](layouts-and-navigation.md) — header, footer and page flags
- [home-page](home-page.md) — the starter home page
