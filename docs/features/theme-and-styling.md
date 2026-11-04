---
feature: theme-and-styling
status: working
files:
  - src/config/colors.css
  - scripts/generate-colors.mjs
  - src/styles/main.css
  - src/styles/main/utilities.css
  - src/components/system/BaseCss.astro
  - src/components/system/Fonts.astro
  - src/components/header/ThemeToggle.astro
  - src/scripts/features/header/index.js
  - src/scripts/load-noncritical-fonts.js
  - public/fonts
  - astro.config.mjs
verified: 2026-11-04 @ 355e3e9
---

# Theme, colours, CSS and fonts

Light/dark theming from one colour file, a utility-class stylesheet, and self-hosted fonts.

## What it does

- **Colour tokens** live in `src/config/colors.css`: light values under `:root, [data-theme="light"]`, dark under `[data-theme="dark"], .dark`. Tokens: `--color-primary|secondary|accent|success|error|alert|note`, `--background-color`, `--text-color`, and `--filter-primary|secondary`.
- `pnpm colors` writes `src/styles/main/colors.css` and derives shade variants (`darker`, `darker-x`, `lighter`, `lighter-x`) from primary and secondary. Invalid hex values fall back to defaults.
- **Dark mode:** the `data-theme` attribute on `<html>`. The header toggle cycles system / light / dark and updates it; the layout's `theme` prop sets the initial value.
- **CSS:** `src/styles/main.css` imports `main/*` (base, variables, typography, utilities). Component CSS is in `src/styles/components/`, page CSS in `src/styles/pages/`, imported by the component or page that needs it. Lightning CSS handles nesting and minification (`astro.config.mjs`, `errorRecovery: true`).
- **Utility classes** are short and consistent (`flex`, `gap`, `p-1`, `my-2`, `max-w-content`, `mi-auto`, `br-r`, `ta-center`, `w-1-5`…). Reuse them before writing new CSS.
- **Fonts:** Inter and Roboto Mono as `woff2` in `public/fonts/`. `Fonts.astro` preloads the Inter Regular and Bold subsets; the rest load later via `src/scripts/load-noncritical-fonts.js`. Served immutable for a year.
- `BaseCss.astro` inlines the base reset with the CSP nonce.

## Common tasks

1. **Change the brand colour:** edit primary (and dark primary) in `colors.css`, **recompute `--filter-primary` for the new colour**, run `pnpm colors`, then set `themeColor` in `brand.mjs` and run `pnpm brand`. Check text contrast in both themes.
2. **Add a utility class:** put it in the matching `src/styles/main/utilities-*.css` file.
3. **Add a font:** put `woff2` files in `public/fonts/`, add `@font-face` in the typography CSS, and preload only what is above the fold.

## Verify

```bash
pnpm colors && git diff --stat src/styles/main/colors.css
pnpm dev     # toggle the theme; reload to confirm it persists
```

## Gotchas

- `--filter-primary` / `--filter-secondary` are pre-computed CSS filter strings, not derived from the hex value. Icons using `filter="primary"` keep the old hue until you update them ([svg-icons](svg-icons.md)).
- `src/styles/main/colors.css` is generated; edit `src/config/colors.css` instead.
- Run `pnpm brand` after changing `themeColor` or `backgroundColor`; the web manifest is generated from them.
- Inline `<style>` needs the CSP nonce ([security-headers](security-headers.md)).

## Related

- [svg-icons](svg-icons.md) — icon filters tied to the colour tokens
- [home-page](home-page.md) — sections and the animated hero use these tokens
- [layouts-and-navigation](layouts-and-navigation.md) — the `theme` prop and toggle placement
- [config-and-generators](config-and-generators.md) — `pnpm colors`, `pnpm brand`
- [quick-start](quick-start.md) — rebrand order
