# Changelog

All notable changes to this project are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CREDITS.md` and GitHub issue and pull request templates.
- Category and tag links and a back link on blog posts.
- Font license file in `public/fonts/` and an icons note in `CREDITS.md`.
- `.github/workflows/ci.yml` (type check, build and docs check) and Dependabot updates.

### Fixed

- `pnpm check` now reports 0 errors: `Astro.locals` is typed in `src/env.d.ts`.
- The `<meta name="generator">` tag is present, so tools can detect Astro.

### Changed

- The contact form is off by default and has no handler URL; turn it on in `src/config/contact.mjs`.
- The home page "need help" section points to the docs and the issue tracker.
- Social link placeholders point at each network's home page.

## [0.1.0] - 2026-11-04

First public release of the free edition.

### Added

- Astro 7 and MDX site, built as static pages and served by a Cloudflare Worker.
- Blog with pagination, tag and category archives, search, RSS, sitemap, `robots.txt` and `llms.txt`.
- Strict security headers and a generated `_headers` file.
- Light and dark theme, text logo, SvgIcon component (inline, sprite, local and external).
- Contact form that sends through a hosted email handler.
- Simple Accept and Decline cookie bar, shown only when a tracking vendor is on.
- Starter home page with an animated hero, About page with credits, and example privacy, cookie and terms pages.
- Config files for brand, pages, colors, security, consent, analytics, ads and contact, with generators in `scripts/`.
- `AGENTS.md`, `CLAUDE.md` and per-feature docs in `docs/`, with a link checker (`pnpm docs_check`).
