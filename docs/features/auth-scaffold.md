---
feature: auth-scaffold
status: scaffold
files:
  - src/middleware.ts
  - src/config/security.mjs
  - src/config/pages.mjs
verified: 2026-11-04 @ 355e3e9
---

# Auth scaffold (Pro, disabled)

`src/middleware.ts` contains the shape of an auth layer, kept for the Pro edition. In Free it is switched off and has no implementation behind it. **Do not build auth features here.**

## What it does

- `securityOptions.auth.enabled` is `false`, so the middleware only sets the nonce and security headers.
- If enabled, it would run route lists (public pages, public/protected APIs, protected pages such as `/dashboard`, `/admin`, `/account`), redirect to `/auth/login?next=…`, answer `401` JSON for protected APIs, and apply MFA/TOTP setup redirects.
- `getCurrentSessionSafe()` and `getMiddlewareUserSafe()` are stubs that return `null`.
- `auth.devBypass` (dev only) would inject a fake admin session.
- `pages.mjs` lists `login`, `signup` and `dashboard` pages with `enabled: authEnabled`; their files (`pages/auth/login.astro` …) do not exist.

## Configure

`securityOptions.auth` in `src/config/security.mjs`: `enabled`, `devBypass`, `routes.*`. Leave `enabled: false`.

## Common tasks

None in Free. Changes to the nonce or header logic in `middleware.ts` belong to [security-headers](security-headers.md) and must keep the auth branch intact.

## Verify

`pnpm build` and `curl -I http://localhost:4321/` should show the security headers with auth off.

## Gotchas

- Turning `enabled: true` today would send every protected path to a login page that does not exist, because the session stubs always return `null`.
- The `Locals` types (`nonce`, `session`, `user`) are declared in `src/env.d.ts`, not in `middleware.ts`.
- Routes listed as "public pages" in the middleware (`/doc`, `/team`, `/review` …) are Pro paths and do not exist here.

## Related

- [security-headers](security-headers.md) — the active half of the same middleware
- [collections](collections.md) — the disabled Pro collections that share these names
