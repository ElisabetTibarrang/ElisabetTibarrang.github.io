# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Copilot, …) working in this repo.
This file is loaded into every session, so it stays short. Detail lives in `docs/`; read only what the task needs.

## What this is

AstroWebTheme Free: an Astro 7 + MDX theme, prerendered (`output: "static"`) and deployed to Cloudflare Workers. Only `/api/contact/` runs on the Worker.
It is **config-driven**: change `src/config/*` first, code second. MIT licensed.
The Free edition excludes auth, dashboards, ERP and advanced layouts (those are Pro) — keep it that way.

## Where to look (load one doc per task, not all of them)

1. Task → feature routing and status: [docs/features/README.md](docs/features/README.md)
2. Doc conventions and how to keep docs current: [docs/README.md](docs/README.md)
3. Known problems and unfinished wiring: [docs/known-gaps.md](docs/known-gaps.md)

## Commands (pnpm 11, Node >= 22.12)

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Dev server on http://localhost:4321 (also defined in `.claude/launch.json`) |
| `pnpm check` | `astro check`. Must report **0 errors**. `Astro.locals` is typed in `src/env.d.ts`. |
| `pnpm build` | Production build to `dist/`. Must pass. |
| `pnpm docs_check` | Validates doc links, feature frontmatter and the AGENTS.md size budget |

Generators — run the one that matches the config you changed:
`pnpm brand | colors | icons | content_config | security_headers | sw | wrangler_json`

## Generated files: edit the source, then regenerate

| Generated | Source of truth | Command |
| --- | --- | --- |
| `src/content.config.mjs`, `src/live.config.mjs` | `src/config/pages.mjs`, `src/config/live.mjs`, `src/schema/*` | `pnpm content_config` |
| `src/styles/main/colors.css` | `src/config/colors.css` | `pnpm colors` |
| `src/data/icons/**`, `public/icons/**` | `src/assets/icons/{mono,brand}/*.svg`, `src/config/svg.mjs` | `pnpm icons` |
| `src/data/brand/manifest.mjs`, `public/brand/**`, favicons, PNG icons, `public/manifest.webmanifest` | `src/config/brand.mjs`, `src/assets/brand/*.svg` | `pnpm brand` |
| `wrangler.jsonc`, `.dev.vars` (gitignored; existing values are kept) | `src/config/wrangler.mjs` | `pnpm wrangler_json` |
| `public/sw.js`, `public/offline.html` | `scripts/generate-sw.mjs` | `pnpm sw` |
| `public/_headers` (gitignored; `pnpm build` writes it when `runtime.mode` is `static`) | `src/config/security.mjs` | `pnpm security_headers` |

## Do not read or hand-edit (large, generated or noisy)

`src/data/icons/**`, `public/icons/**`, `public/fonts/**`, `src/assets/**`, `pnpm-lock.yaml`, `.wrangler/**`, `dist/`, `.astro/`.
Use Grep/Glob with a path filter instead of opening them.

## Rules that prevent the usual mistakes

1. **Trailing slashes everywhere** (`trailingSlash: "always"`). Build entry URLs with `getEntryUrl()` from `src/utils/collections.mjs`, never by hand.
2. **Import with the `@/` alias** (maps to `src/`).
3. **Pages are prerendered.** `security.mjs` `runtime.mode` ("static" default) sets Astro's `output`. Only a route that exports `prerender = false` runs on the Worker (today: `src/pages/api/contact.ts`). In static mode the CSP comes from `public/_headers` and has no nonce: no inline scripts, and keep `build.assetsInlineLimit: 0`.
4. **CSP nonce.** Inline `<script>`/`<style>` must carry `nonce={Astro.locals.nonce}` (pattern: `src/components/schema/JsonLd.astro`, `src/components/system/BaseCss.astro`). Allow a third-party origin through the feature flags in `src/config/security.mjs`, not by editing headers directly.
5. **The blog is hard-coded.** `sitemap.xml`, `rss.xml`, `llms.txt`, `/search/` and the header nav only read `blog`. Enabling another collection in `pages.mjs` generates its schema only; you must add routes and wire those endpoints ([docs/features/collections.md](docs/features/collections.md)).
6. **Tags and categories** are used verbatim as URL segments: write them lowercase-hyphenated.
7. **Secrets stay local.** Never commit `.dev.vars` or `.env`. Config files hold dummy values only (`example.com`, `REPLACE_WITH_…`, `EDIT` comments); keep new placeholders obviously fake, and put real credentials in `.dev.vars` or `wrangler secret put`. Never put the maintainers' own phone, email, social links or calls to action in demo content. D1, KV and R2 are disabled.
8. **No MCP server or CMS.** Removed on purpose (commit `de953f8`). Content access is a GitHub collaborator plus pull requests (see `README.md`). The only API route is `/api/contact/`; mail goes through the email handler, never a provider SDK.
9. **One shared image.** `public/images/featured.png` is the only image: OG card and every example post. It is a neutral placeholder with no names or logos; keep demo images that way. New posts may point `heroImage` at any file in `public/`.

## Working loop

1. Read the one relevant feature doc.
2. Change config before code; regenerate if a generator owns the file.
3. `pnpm check` (0 errors) and `pnpm build`.
4. Update that feature doc in the same change: status, gotchas, `verified:` line. Update `docs/known-gaps.md` if you fixed or found a gap.
5. `pnpm docs_check`.

## Git

Branch `main`. Short imperative subjects ("Point repository URLs at …"). CRLF/LF warnings on Windows are normal; do not convert line endings. Commit or push only when asked.

## Context and memory hygiene

- Durable repo knowledge belongs in `docs/`, not in chat or agent memory. Memory is for user preferences and decisions the repo cannot tell you.
- Link to docs instead of pasting their content; one topic per file; file paths in backticks, no line numbers (they rot).
- Prefer Grep/Glob and targeted reads over opening whole files. Use a search subagent for repo-wide sweeps.
