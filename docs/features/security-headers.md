---
feature: security-headers
status: working
files:
  - src/config/security.mjs
  - src/middleware.ts
  - scripts/generate-security-headers.mjs
  - src/components/schema/JsonLd.astro
  - src/components/system/BaseCss.astro
verified: 2026-11-04 @ 355e3e9
---

# Security headers and CSP

Strict response headers and a Content-Security-Policy, driven by `src/config/security.mjs`.

## What it does

- **Static mode (current, `runtime.mode: "static"`):** `pnpm build` first runs `pnpm security_headers`, which writes `public/_headers` (gitignored, copied to `dist/client/_headers`). The CSP there cannot use a nonce, so it allows inline `<style>` (`staticAllowInlineStyle`) but no inline scripts. `astro.config.mjs` sets `build.assetsInlineLimit: 0` so no script or asset is inlined into a page; the build was checked to contain no executable inline script and no `data:` URL. `src/middleware.ts` still runs for the Worker route `/api/contact/` and in dev.
- **Server mode (`runtime.mode: "server"`):** `src/middleware.ts` makes a random nonce per request, exposes it as `Astro.locals.nonce`, adds the headers to every response and a nonce-based CSP to HTML responses. XML, JSON, text and `.webmanifest` responses get the headers but no CSP. Astro-inlined module scripts carry no nonce, so keep `assetsInlineLimit: 0`.
- Headers set: CSP, `Strict-Transport-Security` (with `preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy: same-origin`, `Origin-Agent-Cluster`, `X-Permitted-Cross-Domain-Policies`, optional `Reporting-Endpoints`.
- Base CSP is deny-by-default: `default-src 'none'`, `frame-ancestors 'none'`, `object-src 'none'`, `script-src-attr 'none'`, `upgrade-insecure-requests`.
- Cache headers by route: `/_astro/`, `/fonts/`, `/icons/`, `/brand/` immutable for a year; `/api/` no-store; HTML `max-age=0, must-revalidate`.
- In dev the policy is sent as `Content-Security-Policy-Report-Only`.

## Configure (`securityOptions`)

| Option | Effect |
| --- | --- |
| `runtime.mode` | `"static"` (prerendered site + `_headers`) or `"server"` (middleware, nonce). Also sets Astro's `output` in `astro.config.mjs` |
| `hsts` | Enable and value |
| `csp.reportUri`, `endpoints.cspReportHandler` | Adds `report-uri` and `Reporting-Endpoints`. Both are `""` (off); paste your collector URL to enable |
| `csp.staticAllowInlineStyle` / `staticAllowInlineScript` | Static mode only |
| `features.*` | `googleAnalytics`, `googleTagManager`, `cloudflareAnalytics`, `cloudflareRum`, `turnstile`, `adsense`, `googleFonts`, `youtube`, `vimeo`, `productHunt`, `gravatar`: each adds that vendor's origins |

## Common tasks

1. **Allow a known vendor:** set its flag in `securityOptions.features`.
2. **Allow a new vendor:** add a flag and an `if (features.x)` block in `buildDirectivesBase()` that calls `add(h, "<directive>", [origins])`.
3. **Use an inline script or style:** add `nonce={Astro.locals.nonce}` (see `JsonLd.astro`, `BaseCss.astro`). In static mode a nonce is not enforced; inline styles work, inline scripts do not. Never add `'unsafe-inline'` for scripts.
4. **Switch to server rendering:** set `runtime.mode: "server"` (also changes Astro's `output`), then `pnpm build`.

## Verify

```bash
curl -I http://localhost:4321/     # dev: Content-Security-Policy-Report-Only
pnpm build                          # then inspect dist/client/_headers
```

`dist/client/_headers` must contain one `Content-Security-Policy` per route block. A blocked resource shows as a CSP violation in the browser console of a production build (dev only reports).

## Gotchas

- Vendor flags here are separate from `analytics.mjs` / `ads.mjs` (see [consent-analytics-ads](consent-analytics-ads.md)). Turn both on or the script is blocked.
- `script-src-attr 'none'` blocks inline event attributes (`onclick=…`). Use `addEventListener` in a script instead.
- `Cross-Origin-Resource-Policy: same-origin` and `X-Frame-Options: DENY` stop other sites embedding your pages or hotlinking your assets.
- HSTS includes `preload` and `includeSubDomains`; keep it only if every subdomain serves HTTPS.
- The `Astro.locals` types (`nonce`, `session`, `user`) live in `src/env.d.ts`. Add a new local there, not in `middleware.ts`.

## Related

- [consent-analytics-ads](consent-analytics-ads.md) — third-party scripts that need CSP flags
- [contact-form](contact-form.md) — the Worker route behind `/api/contact/` and the Turnstile origin
- [auth-scaffold](auth-scaffold.md) — the disabled auth path in the same middleware
- [config-and-generators](config-and-generators.md) — `pnpm security_headers`
- [cloudflare-and-pwa](cloudflare-and-pwa.md) — where headers are served from
- [search](search.md) — a form handled by a `submit` listener because inline handlers are blocked
- [seo-and-schema](seo-and-schema.md) — JSON-LD blocks carry the nonce
- [svg-icons](svg-icons.md) — external icon hosts need `img-src`
