# Security policy

## Supported versions

Security fixes are made for the latest release.

| Version | Supported |
| --- | --- |
| 0.1.x | Yes |

## Reporting a vulnerability

Please do not open a public issue for a security problem.

1. Go to the **Security** tab of this repository.
2. Choose **Report a vulnerability** to send a private report.
3. Describe what you found, how to reproduce it and which version you used.

You will get a first reply within 7 days. We will keep you updated while we work on a fix, and we will credit you in the changelog if you wish.

## What counts

- A way to run script on a page that has the theme's default security headers.
- A way to read or change data through the contact route (`/api/contact/`).
- A secret or credential committed to the repository.

Weak settings in a site you built from this theme (for example an extra origin you allowed in `src/config/security.mjs`) are your own configuration. Questions about those are welcome in a normal issue.

## For people using the theme

- Never commit `.dev.vars` or `.env`. Set real credentials with `wrangler secret put`.
- Keep Astro and its integrations up to date.
- Run `pnpm build` and look at `dist/client/_headers` after you change `src/config/security.mjs`.
