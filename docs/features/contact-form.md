---
feature: contact-form
status: partial
files:
  - src/pages/contact-us.astro
  - src/pages/api/contact.ts
  - src/scripts/features/contact/index.js
  - src/config/contact.mjs
  - src/config/wrangler.mjs
  - src/config/brand.mjs
  - src/styles/pages/contact-form.css
  - src/components/features/captcha/Turnstile.astro
verified: 2026-11-04 @ 355e3e9
---

# Contact form

**The form is off by default** (`enabled: false`, no `handlerUrl`). `/contact-us/` then shows only the contact cards, the address and a note, and `/api/contact/` answers 404. When you turn it on, the form posts to `/api/contact/`, a Worker route that forwards the message to an email handler service. There is no mail provider to configure: the handler sends the email.

## What it does

- The page is prerendered. `src/pages/api/contact.ts` is the only route that runs on the Worker (`prerender = false`).
- `src/scripts/features/contact/index.js` sends the form as JSON and shows the result in an `aria-live` status line. Without JavaScript the form shows a `<noscript>` note with the contact email.
- The route checks: same-origin browser request, `application/json`, 10 kB body cap, honeypot field `website`, required `name` / `email` / `subject` / `message`, email shape, subject must be one of `contactConfig.subjects`.
- It then POSTs to `contactConfig.handlerUrl` with headers `x-tenant-id`, `x-tenant-domain` and `Authorization: Bearer <token>` and body `{ template: "contact-form", kind: "transactional", to, data: { brand, name, email, subject, message, requestType } }`. An 8 s timeout applies.
- The browser never sees the handler URL, tenant ID or token, so the CSP needs no extra origin.
- Contact cards (email, phone, WhatsApp) and the address come from `brand.mjs`; empty values are hidden.

## Turn it on (free plan: 100 submissions per month)

1. Register with NViewsWEB (the email handler). Send your **domain name, name and email address** by WhatsApp to +91 87781 90183 or by email to hello@nviewsweb.com. You receive a handler URL, a tenant ID and a token.
2. In `src/config/contact.mjs` set `enabled: true` and put the URL in `handlerUrl`.
3. Local: put `TENANT_ID` and `TENANT_API_TOKEN` in `.dev.vars` (`pnpm wrangler_json` creates placeholder lines and never overwrites existing values).
4. Deployed: `pnpm exec wrangler secret put TENANT_ID` and `pnpm exec wrangler secret put TENANT_API_TOKEN`.
5. Submit the form on `/contact-us/` and confirm the email arrives.

While `enabled` is true but the URL or a secret is missing, the route answers `503 not_configured` and the page tells the visitor to email instead.

## Configure

| Option | File | Effect |
| --- | --- | --- |
| `enabled` | `src/config/contact.mjs` | `false` (default) hides the form and the API answers 404 |
| `handlerUrl` | `src/config/contact.mjs` | Where messages are forwarded. Empty by default (https only; `example.com` hosts count as not configured) |
| `subjects` | `src/config/contact.mjs` | Subject dropdown and the API allow-list |
| `TENANT_ID`, `TENANT_API_TOKEN` | `.dev.vars` / Worker secrets | Handler credentials. Never put them in config files |
| `contact.email`, `phone`, `whatsapp` | `src/config/brand.mjs` | Cards; set `""` to hide |
| `contact` page flags and copy | `src/config/pages.mjs` | Title, description, nav, sitemap |

## Common tasks

- **Add a field:** add the input in `contact-us.astro`, read and validate it in `contact.ts`, add it to the forwarded `data`. The handler template decides whether it is shown.
- **Add a captcha:** see G20. Set `features.turnstile: true` in `security.mjs`, place `<Turnstile sitekey="…" />` in the form, and verify the token in `contact.ts` with a `TURNSTILE_SECRET` secret before forwarding.

## Verify

```bash
pnpm dev
curl -s -X POST http://localhost:4321/api/contact/ -H "Content-Type: application/json" -H "Origin: http://localhost:4321" -d '{"name":"A","email":"a@b.co","subject":"Support","message":"hi"}'
```

Expect `{"ok":false,"error":"not_configured"}` with placeholder secrets and `{"ok":true}` once real credentials are set. Also submit the form in the browser and read the status line.

## Gotchas

- Static hosting without the Worker cannot run `/api/contact/`; this route needs `@astrojs/cloudflare`.
- Use the trailing slash: `trailingSlash` is `"always"`.
- The request shape is copied from the Pro edition's contact route and was not tested against the live handler (G21).
- Only a honeypot, a size cap and a same-origin check guard the form (G20). Bots can consume the monthly quota.
- `Turnstile.astro` imports `cloudflare:workers`, so it works only through the Cloudflare adapter.

## Related

- [security-headers](security-headers.md) — `form-action 'self'`, `connect-src 'self'` and the Turnstile flag
- [config-and-generators](config-and-generators.md) — `pnpm wrangler_json` and `.dev.vars`
- [seo-and-schema](seo-and-schema.md) — `ContactPage` schema type
- [cloudflare-and-pwa](cloudflare-and-pwa.md) — Worker secrets and deployment
- [quick-start](quick-start.md) — registering for the handler during setup
- [home-page](home-page.md) — the note that points here
