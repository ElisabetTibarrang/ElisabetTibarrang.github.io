---
feature: cloudflare-and-pwa
status: partial
files:
  - astro.config.mjs
  - wrangler.jsonc
  - src/config/wrangler.mjs
  - scripts/generate-wrangler.mjs
  - scripts/generate-sw.mjs
  - public/sw.js
  - public/offline.html
  - public/manifest.webmanifest
  - .gitignore
verified: 2026-11-04 @ 355e3e9
---

# Cloudflare deployment and PWA

A prerendered static site served as Worker static assets, plus one Worker route (`/api/contact/`). A service worker, offline page and web manifest are generated but not all are active.

## What it does

- **Adapter:** `@astrojs/cloudflare` with `imageService: "compile"` (images optimised at build time with sharp; no runtime image service). Astro's `output` follows `securityOptions.runtime.mode` (`"static"` by default).
- **No Cloudflare resources:** D1, KV and R2 are disabled in `src/config/wrangler.mjs` and hold dummy values, so `wrangler.jsonc` has no bindings. `astro.config.mjs` sets a `memory` session driver; without it the adapter adds a `SESSION` KV binding that `wrangler deploy` would create.
- **`wrangler.jsonc`** (generated, safe to commit): Worker name, `ASSETS` from `./dist`, compatibility date and flag, observability on.
- **Local secrets:** `.dev.vars` (gitignored) gets placeholder `TENANT_ID` and `TENANT_API_TOKEN` lines. Existing values and unrelated keys in the file are kept on every run.
- **Service worker** (`public/sw.js`): caches same-origin GET requests for styles, scripts, fonts, images and a list of file extensions; falls back to `/offline.html`; cache name `astrowebtheme-free-runtime-v1`.
- **Manifest:** `public/manifest.webmanifest` from `pnpm brand`.

## Common tasks

1. **Deploy:** set `projectName` in `wrangler.mjs`, `pnpm wrangler_json`, set the two contact secrets with `wrangler secret put`, then `pnpm build && pnpm exec wrangler deploy`.
2. **Change the Worker name or add routes:** edit `src/config/wrangler.mjs`, run `pnpm wrangler_json`.
3. **Add a D1, KV or R2 binding:** create the resource with wrangler, paste the real IDs over the dummy values, set `enabled: true`, run `pnpm wrangler_json`. For KV sessions also switch the session driver in `astro.config.mjs`.
4. **Activate the service worker:** register `/sw.js` from an external script (the CSP already allows `worker-src 'self'`); then rename `CACHE_NAME` in `scripts/generate-sw.mjs` and run `pnpm sw` (G12).

## Verify

```bash
pnpm build                 # must finish with "Complete!"
pnpm exec wrangler deploy --dry-run
```

`dist/server/wrangler.json` should list empty `kv_namespaces`, `d1_databases` and `r2_buckets`.

## Gotchas

- Nothing registers the service worker, so caching and the offline page are inactive (G12).
- `.wrangler/` (local Miniflare state) is gitignored and no longer tracked.
- `dist/server/.prerender/.dev.vars` receives a copy of your local secrets during `pnpm build`; never publish `dist/`.
- The service worker's cache name and cleanup prefix are hard-coded to `astrowebtheme-free`.
- Never commit `.dev.vars` or `.env`.

## Related

- [config-and-generators](config-and-generators.md) — `wrangler_json` and `sw`
- [security-headers](security-headers.md) — `_headers` served with the static assets; `worker-src`
- [contact-form](contact-form.md) — the Worker route and its secrets
- [quick-start](quick-start.md) — rebrand order
