---
feature: home-page
status: working
files:
  - src/pages/index.astro
  - src/components/HeroOrbit.astro
  - src/styles/components/hero-orbit.css
  - src/styles/pages/home-page.css
  - src/scripts/features/copy/index.js
verified: 2026-11-04 @ 355e3e9
---

# Home page

The starter home page is a "how to start" guide: an animated hero, five numbered steps with copy-able commands, a feature grid, a "Need help?" section, a short FAQ and a closing call to action. It contains no company advertising: the only outside links are the repository, its docs and its issue tracker. Replace the copy with your own.

## What it does

- **Hero:** headline, lead, two buttons (jump to the steps, see an example post) and `HeroOrbit`, an animated space scene: twinkling stars, a sun, five planets on circular paths (one with a moon, one with a ring) and two passing comets. It is SVG plus CSS only: no script, no image, no inline styles. The scene has no card or border: its purple (mixed from the brand colour) and the picture fade out at the edge with a mask, so it melts into the hero background in light and dark mode. Motion stops when the visitor prefers reduced motion; the planets then sit at fixed angles.
- **Steps:** five cards. The clone command reads the repository URL and folder name from `package.json`, so renaming the repository there updates the page. Copy buttons use `src/scripts/features/copy/index.js` (`data-copy` attribute).
- **Need help?** (`#help`): three cards that link to the repository docs, the issue list and the new-issue form. The links are built from `package.json` (`repository.url`, `bugs.url`), so they follow a rename.
- **Contact form note:** under the steps, points to the contact form doc ([contact-form](contact-form.md)).
- Site name and contact cards elsewhere come from `brand.mjs`; the featured image `public/images/featured.png` (a neutral placeholder) is used only for link previews and the example posts, not for the hero.

## Configure

| What | Where |
| --- | --- |
| Headline, steps, features, FAQ text | `src/pages/index.astro` (constants at the top) |
| Help links | `package.json` (`repository.url`, `bugs.url`) |
| Orbit speeds, colours, number of stars | `HeroOrbit.astro` (stars, planets) and `hero-orbit.css` (`.orbit--1` … `--5` durations) |
| Layout and colours of the sections | `src/styles/pages/home-page.css` (`start-*` classes) |

## Common tasks

1. **Turn the guide into a normal home page:** rewrite `index.astro`; delete `home-page.css` rules you stop using.
2. **Use an image instead of the animation:** replace `<HeroOrbit />` with an `<img src={brandConfig.featuredImage}>` (give it width, height and `loading="eager"`).
3. **Slow down or remove a planet:** change its `animation-duration` or delete its `<g class="orbit orbit--N">` in `HeroOrbit.astro`.

## Verify

`pnpm dev`, open `/`. The scene should move; switch the OS to "reduce motion" and reload to see it still. Check `/` at phone width for horizontal scroll, and in dark mode.

## Gotchas

- Keep the demo free of your own marketing: no company phone numbers, emails, social profiles or calls to action. The Astro theme catalogue rejects themes that advertise their author.
- Inline `style` attributes cannot be used in the scene (server-mode CSP); delays come from `:nth-child` rules.
- The Copy button needs a real click and a secure context (HTTPS or localhost) for the clipboard; if the clipboard is blocked the button shows "Press Ctrl+C".

## Related

- [quick-start](quick-start.md) — the rebrand checklist
- [contact-form](contact-form.md) — setting up the email handler
- [theme-and-styling](theme-and-styling.md) — colour tokens used by the sections
- [layouts-and-navigation](layouts-and-navigation.md) — `PageLayout`, the header and the footer credit
- [legal-and-about-pages](legal-and-about-pages.md) — the other starter pages
