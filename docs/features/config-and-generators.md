---
feature: config-and-generators
status: working
files:
  - src/config/brand.mjs
  - src/config/pages.mjs
  - src/config/constants.mjs
  - src/config/colors.css
  - src/config/security.mjs
  - src/config/consent.mjs
  - src/config/analytics.mjs
  - src/config/ads.mjs
  - src/config/svg.mjs
  - src/config/wrangler.mjs
  - src/config/contact.mjs
  - src/config/live.mjs
  - scripts/generate-brand.mjs
  - scripts/generate-colors.mjs
  - scripts/generate-icons.mjs
  - scripts/generate-content-config.mjs
  - scripts/generate-security-headers.mjs
  - scripts/generate-sw.mjs
  - scripts/generate-wrangler.mjs
  - package.json
verified: 2026-11-04 @ 355e3e9
---

# Config files and generators

Site behaviour is set in `src/config/*`. Some outputs are generated from that config by `scripts/*`; those generated files must not be hand-edited.

## Config files

| File | Controls | Regenerate with |
| --- | --- | --- |
| `brand.mjs` | Identity, SEO defaults, contact, social, share links, default author, organization schema, robots, favicon/app-icon input | `pnpm brand` (assets only) |
| `pages.mjs` | Static pages, collections, field collections (tags…), per-page flags (`sitemap`, `llms`, nav) | `pnpm content_config` (collections only) |
| `constants.mjs` | Allowed enum values used by `pages.mjs` | — |
| `colors.css` | Light and dark colour tokens | `pnpm colors` |
| `security.mjs` | CSP, headers, feature flags for third-party origins, runtime mode (`static` or `server`, also sets Astro's `output`) | `pnpm security_headers` (static mode only; `pnpm build` runs it) |
| `contact.mjs` | Contact form on/off, email handler URL, subject list | none (read at render) |
| `consent.mjs`, `analytics.mjs`, `ads.mjs` | Consent banner, analytics vendors, AdSense | none (read at render) |
| `svg.mjs` | Icon input/output folders and SVGO plugins | `pnpm icons` |
| `wrangler.mjs` | Cloudflare bindings, compatibility date, local secrets | `pnpm wrangler_json` |
| `live.mjs` | Optional live (runtime) collections | `pnpm content_config` |

`brand.mjs` normalises `siteUrl` and `organization.url` to end with `/`.

## Generators

| Command | Reads | Writes |
| --- | --- | --- |
| `pnpm brand` | `brand.mjs`, `src/assets/brand/*.svg` | `public/brand/*`, `favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-*.png`, `src/data/brand/manifest.mjs`, `public/manifest.webmanifest` |
| `pnpm colors` | `src/config/colors.css` | `src/styles/main/colors.css` |
| `pnpm icons` | `src/assets/icons/{mono,brand}` | `public/icons/*`, `src/data/icons/**`, `src/data/icons/manifest.mjs` |
| `pnpm content_config` | `pages.mjs`, `live.mjs`, `src/schema/*` | `src/content.config.mjs`, `src/live.config.mjs` |
| `pnpm security_headers` | `security.mjs` | `public/_headers` (`--dist` writes `dist/_headers`); skipped unless `runtime.mode` is `static` |
| `pnpm sw` | — | `public/sw.js`, and `public/offline.html` only if missing |
| `pnpm wrangler_json` | `wrangler.mjs` | `wrangler.jsonc`, `.dev.vars` (placeholder `TENANT_ID` / `TENANT_API_TOKEN` when absent; existing values and other keys are kept) |

## Common tasks

1. **Change a config value** → edit the file → run its generator if one is listed → `pnpm build`.
2. **Add a collection** → see [collections](collections.md); always finish with `pnpm content_config`.
3. **Add a generator** → add `scripts/generate-<x>.mjs`, a snake_case script in `package.json`, a row in both tables above and in the generated-files table in `AGENTS.md`.

## Verify

Run the generator, then `git diff` its outputs. A non-empty diff on a config you did not touch means the committed output was stale; review it before committing. Right now `pnpm brand`, `pnpm colors` and `pnpm content_config` should produce no diff.

## Gotchas

- Generated files carry an "AUTO-GENERATED" or "Do not edit" header. Edit the source instead.
- `scripts/generate-content-all.mjs` and `scripts/generate-live-config.mjs` are stale and not wired to `package.json` (G8). Use `pnpm content_config`.
- `wrangler.mjs` holds dummy binding IDs, all disabled. Replace them with real ones only when you enable a binding.
- `config/security.mjs` and `config/analytics.mjs` are separate: turning a vendor on in one does not turn it on in the other (see [consent-analytics-ads](consent-analytics-ads.md)).

## Related

- [quick-start](quick-start.md) — the order to change things when starting a site
- [collections](collections.md) — what `pnpm content_config` produces
- [security-headers](security-headers.md) — `security.mjs` in depth
- [svg-icons](svg-icons.md) — the icon pipeline
- [cloudflare-and-pwa](cloudflare-and-pwa.md) — `wrangler.mjs` and `sw`
- [theme-and-styling](theme-and-styling.md) — `colors.css`
- [consent-analytics-ads](consent-analytics-ads.md) — `consent.mjs`, `analytics.mjs`, `ads.mjs`
- [contact-form](contact-form.md) — `contact.mjs`, secrets and the email handler
- [field-collections](field-collections.md) — taxonomy fields in the generated schema
