# AstroWebTheme Free

A fast, secure Astro 7 theme for content sites: a blog with tags, categories, search and feeds, a contact form, light and dark mode and strict security headers. You change a few config files and write posts in Markdown. It is built as static pages and served by a Cloudflare Worker.

**Live demo:** <https://free.astrowebtheme.com>

## What is included

- Blog with pagination, tag and category archives, search, RSS, `sitemap.xml`, `robots.txt` and `llms.txt`
- Light and dark theme, text logo, responsive layout, accessible markup
- Optional contact form that sends email through a handler you choose (off by default)
- Strict Content-Security-Policy and other security headers, generated as a `_headers` file
- A simple Accept and Decline cookie bar that only appears when a tracking script is turned on
- Example home, About, Privacy, Cookie and Terms pages with made-up content
- Optional Google Analytics, Tag Manager, Cloudflare Analytics and AdSense, behind consent
- Config-driven setup: names, colours, pages and features live in `src/config/`
- Docs for every feature in [`docs/features/`](docs/features/README.md)

## Built with

[Astro](https://astro.build) 7, MDX, TypeScript, Lightning CSS, `@astrojs/cloudflare` for Cloudflare Workers. No UI framework and no Tailwind. See [CREDITS.md](CREDITS.md).

## Getting started

You need Node.js 22.12 or newer and [pnpm](https://pnpm.io) 11.

```bash
git clone https://github.com/nviewsweb/astrowebtheme-free.git
cd astrowebtheme-free
pnpm install
pnpm dev
```

Open `http://localhost:4321`. The home page of the theme walks you through the next steps: make it yours, write a post, go live. The template ships with made-up content: a placeholder brand, three example posts and one shared image. Search a file for `EDIT` to find the values to change.

## Where to change things

| You want to change | Edit | Then run |
| --- | --- | --- |
| Site name, URL, description, contact, social links | `src/config/brand.mjs` | `pnpm brand` |
| Colours | `src/config/colors.css` | `pnpm colors` |
| Which pages and collections are on, nav and footer links | `src/config/pages.mjs` | `pnpm content_config` if you enable a collection |
| Posts | `src/content/blog/*.mdx` | |
| Home page, About and legal text | `src/pages/*.astro` | |
| Favicon and app icons | `src/assets/brand/favicon.svg` | `pnpm brand` |
| The shared image | `public/images/featured.png` | |
| Security headers and allowed third-party origins | `src/config/security.mjs` | `pnpm build` |
| Analytics, ads, cookie bar | `src/config/analytics.mjs`, `ads.mjs`, `consent.mjs` | |
| Contact form handler | `src/config/contact.mjs` | |
| Worker name and Cloudflare settings | `src/config/wrangler.mjs` | `pnpm wrangler_json` |

The full checklist is in [docs/features/quick-start.md](docs/features/quick-start.md).

## Project structure

```text
docs/               One page per feature, written for people and AI coding agents
public/             Static files: fonts, favicon, images
scripts/            Generators for brand assets, colours, icons, headers and Wrangler config
src/components/     Reusable Astro components (header, footer, SEO, icons, UI)
src/config/         All settings: brand, pages, colours, security, consent, contact
src/content/        Blog posts (Markdown and MDX)
src/layouts/        Page and article layouts
src/pages/          Routes and endpoints (pages, feeds, the contact API route)
src/schema/         Content schemas
src/scripts/        Small browser scripts, loaded as external files
src/styles/         CSS, including the colour tokens and utility classes
```

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm check` | Type check (Astro and TypeScript) |
| `pnpm build` | Write security headers, then build to `dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm brand` | Generate favicons and the web manifest |
| `pnpm colors` | Generate the colour CSS |
| `pnpm icons` | Generate the icon manifest |
| `pnpm content_config` | Generate the content collection config |
| `pnpm security_headers` | Generate `public/_headers` |
| `pnpm wrangler_json` | Generate `wrangler.jsonc` and `.dev.vars` |
| `pnpm docs_check` | Check the docs links and frontmatter |

## Contact form

The form is **off by default**: `/contact-us/` shows your contact cards and a note. To turn it on, set `enabled: true` and a handler URL in `src/config/contact.mjs` and add two secrets. The form then posts to `/api/contact/`, a Worker route that forwards the message to the handler. See [docs/features/contact-form.md](docs/features/contact-form.md) for the steps.

## Deploy to Cloudflare

The site is prerendered (`output: "static"`) and served by a Cloudflare Worker with static assets. Only `/api/contact/` runs code. No D1, KV or R2 resources are used.

```bash
pnpm wrangler_json   # set projectName in src/config/wrangler.mjs first
pnpm build
pnpm exec wrangler deploy
```

Never commit `.dev.vars`, `.env`, tokens or other secrets.

## Working with an editor or contractor

To let someone write posts, add them as a collaborator on your GitHub repository and ask them to open pull requests. Nothing reaches `main` until you merge it. There is no CMS and no content API.

## Getting help

- Read the page for your feature in [docs/features](docs/features/README.md).
- Known problems are listed in [docs/known-gaps.md](docs/known-gaps.md).
- Ask a question or share an idea in [Discussions](https://github.com/nviewsweb/astrowebtheme-free/discussions).
- Found a bug or want a feature? Search the [issues](https://github.com/nviewsweb/astrowebtheme-free/issues), then open a new one with the form that fits. [CONTRIBUTING.md](CONTRIBUTING.md) explains how issues and discussions are handled.
- Security problems: see [SECURITY.md](SECURITY.md).

## Contributing

Pull requests are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md) and the [code of conduct](CODE_OF_CONDUCT.md). Changes are listed in [CHANGELOG.md](CHANGELOG.md). AI coding agents should start at [AGENTS.md](AGENTS.md).

## License

AstroWebTheme Free is available under the [MIT License](LICENSE). The bundled fonts have their own license, and the icon sources are described in [CREDITS.md](CREDITS.md). A separate paid edition exists; it is not part of this repository.
