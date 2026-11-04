---
feature: consent-analytics-ads
status: working
files:
  - src/config/consent.mjs
  - src/config/analytics.mjs
  - src/config/ads.mjs
  - src/config/security.mjs
  - src/utils/consent-needed.mjs
  - src/components/features/consent/ConsentBanner.astro
  - src/scripts/features/consent/index.js
  - src/styles/components/consent-banner.css
  - src/components/features/analytics/AnalyticsHead.astro
  - src/components/features/analytics/AnalyticsBody.astro
  - src/components/features/analytics/AnalyticsLoader.astro
  - src/scripts/features/analytics/index.js
  - src/components/features/ads/AdSenseHead.astro
  - src/components/features/ads/AdSenseLoader.astro
  - src/components/features/ads/AdSenseSlot.astro
  - src/scripts/features/ads/index.js
  - src/layouts/BaseLayout.astro
verified: 2026-11-04 @ 355e3e9
---

# Consent, analytics and ads

A small cookie bar plus optional analytics and AdSense that load only when allowed.

## What it does

- **The bar** (`ConsentBanner.astro` + `src/scripts/features/consent/index.js`): one line of text, **Decline** and **Accept**. No checkboxes, no overlay, no scroll lock. Accept grants analytics and ads, Decline denies both. The choice is stored in a JSON cookie (`cookieName`, `SameSite=Lax`, `Secure` on HTTPS) for `ttlDays`. A small shield button reopens the bar later.
- **It appears only when needed.** `src/utils/consent-needed.mjs` checks `analytics.mjs` and `ads.mjs`: the bar is rendered when GA4, GTM, Cloudflare Analytics or Ahrefs is on **and** needs consent, or AdSense is on. With none of them on (the shipped state), there is no bar, no cookie and no consent script.
- **Google Consent Mode:** the script sends `consent update` (`granted` or `denied` for all storage types) and optional `url_passthrough` / `ads_data_redaction`.
- **Analytics** (`AnalyticsHead/Body/Loader`): Google Tag Manager, GA4, Cloudflare Web Analytics or RUM, Ahrefs.
- **AdSense** (`AdSenseHead/Loader`): site-level loader behind consent. `AdSenseSlot.astro` exists but is not placed anywhere (G6).
- All are mounted by `BaseLayout.astro`. Loaders read `window.__consent` and the `consent:*` events the script dispatches.

## Configure

| File | Key options |
| --- | --- |
| `consent.mjs` | `enabled` (master switch), `cookieName`, `ttlDays`, `version` (bump to ask everyone again), `position` (`bottom`, `bottom-left`, `bottom-right`), `policyUrl`, `googleConsentMode` |
| `analytics.mjs` | `enabled`, `prodOnly` (no analytics in dev), per vendor `enabled`, id/token and `consentRequired` |
| `ads.mjs` | `enabled`, `adsenseClientId` (`ca-pub-…`), `consentRequired`, `headMeta` |
| `security.mjs` | `features.googleAnalytics`, `googleTagManager`, `cloudflareAnalytics`, `cloudflareRum`, `adsense`: CSP allowlists |

## Common tasks

**Enable GA4:**

1. `analytics.mjs`: `googleAnalytics: { enabled: true, id: "G-XXXXXXXXXX", consentRequired: true }`.
2. `security.mjs`: `features.googleAnalytics = true`.
3. Update the privacy and cookie policy pages to name the vendor.
4. `pnpm build`, test in a production build (see Verify). The bar now appears.

GTM, Cloudflare Analytics and AdSense follow the same two-place pattern.

**Change the wording or look:** the sentence is built in `ConsentBanner.astro` (`purpose`); styles are in `consent-banner.css`.

## Verify

Analytics is off in dev (`prodOnly`). Build and run a production-mode server, open the site in a private window and confirm the bar appears only when a vendor is on. In the Network tab confirm no vendor requests before Accept and the requests after Accept. Check the console for CSP violations. Clear the `site_consent` cookie to see the bar again.

## Gotchas

- **Two switches per vendor:** the feature config and the CSP flag in `security.mjs`. Missing the second blocks the script silently.
- IDs are pattern-checked (`GTM-…`, `G-…`, 32 hex for Cloudflare). A malformed id turns that vendor off without an error.
- GTM takes precedence: GA4 is used only when GTM is not. Cloudflare Analytics is skipped when RUM is enabled.
- As shipped, Cloudflare Analytics and Ahrefs have `consentRequired: false`, so they alone never trigger the bar; GTM and GA4 have `true`.
- Accept and Decline are all-or-nothing. If you need separate analytics and ad choices, the old checkbox panel is in git history.
- Changing `version` clears prior choices on the next visit.

## Related

- [security-headers](security-headers.md) — the CSP flags
- [layouts-and-navigation](layouts-and-navigation.md) — where these mount in `BaseLayout`
- [config-and-generators](config-and-generators.md) — config file map
- [legal-and-about-pages](legal-and-about-pages.md) — the cookie policy page follows this config
