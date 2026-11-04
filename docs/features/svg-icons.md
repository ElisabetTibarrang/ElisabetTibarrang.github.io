---
feature: svg-icons
status: working
files:
  - src/components/svg/SvgIcon.astro
  - src/components/svg/IconSprite.astro
  - src/config/svg.mjs
  - scripts/generate-icons.mjs
  - src/data/icons/manifest.mjs
  - src/styles/components/icon.css
  - src/assets/icons/mono
  - src/assets/icons/brand
verified: 2026-11-04 @ 355e3e9
---

# SvgIcon

One component renders any icon as a local file, inline SVG, sprite reference or externally hosted file. The library has 62 mono and 10 brand icons.

## What it does

| `source` | Output | Colour from CSS `currentColor`? |
| --- | --- | --- |
| `local` (default) | `<img src="/icons/<kind>/<name>.svg">` | No; `filter` (default `base`) colours it |
| `inline` | Inline `<svg>` with the icon body | Yes |
| `sprite` | `<svg><use href="#aw-icon-…">` | Yes; needs `<IconSprite>` on the page |
| `external` | `<img src="<baseUrl>/<kind>/<name>.svg">` | No; `filter` (default `base`) colours it |

Brand icons keep their own colours and always use a URL (`sprite`/`inline` requests fall back to `local`). Legacy `mode="img" | "url"` means `local`.

```astro
<SvgIcon name="email" />
<SvgIcon name="email" source="inline" size="lg" />
<IconSprite names={["menu", "close"]} /><SvgIcon name="menu" source="sprite" />
<SvgIcon name="facebook" kind="brand" />
<SvgIcon name="email" source="external" baseUrl="https://cdn.example.com/icons" />
```

## Props

`name` (required), `kind` (`mono`|`brand`), `source`, `size` (`sm`…`3xl`, default `md`), `filter` (`primary`, `secondary`, `accent`, `success`, `error`, `alert`, `note`, `black`, `white`, `base`, `base-invert`, `primary-dark`; mono + URL sources only), `fillColor`, `bgColor`, `title`, `decorative` (default `true`; `false` adds `role="img"` and a label), `wrapper` (tag, default `span`), `id`, `data`, `class`, `svgClass`, `imgClass`, `loading`, `decoding`.

## Common tasks

1. **Add an icon:** save `my-icon.svg` in `src/assets/icons/mono/` (or `brand/`), run `pnpm icons`, use `name="my-icon"`. The name is the slugified file name.
2. **Host icons on a CDN:** upload `public/icons/{mono,brand}/` keeping the folders, then use `source="external"` with `baseUrl`.
3. **Use many icons on one page:** render one `<IconSprite names={[…]} />` (it de-duplicates per request) and use `source="sprite"`.
4. **Tune optimisation:** edit `svgo` in `src/config/svg.mjs`.

## Verify

```bash
pnpm icons && git status --short src/data/icons public/icons
```

New icons add one file in each folder plus a manifest update. Then check the rendered element in the page.

## Gotchas

- An unknown `name` with `source="local"` or `inline` renders nothing (no error).
- Mono `<img>` icons are plain black files. The default `filter="base"` turns them white in dark mode; pass `filter="none"` to opt out. Before this default, header icons vanished in dark mode, and `.filter-base` pointed at variables that do not exist. Test new icon placements in both themes.
- `filter="primary"` uses the `--filter-primary` CSS variable, which is hand-maintained; update it when the brand colour changes ([theme-and-styling](theme-and-styling.md)).
- `src/data/icons/**` and `public/icons/**` are generated and large; do not read or edit them.
- Generated SVG ids are prefixed `aw-icon-` to avoid collisions.

## Related

- [theme-and-styling](theme-and-styling.md) — colour tokens and filters
- [layouts-and-navigation](layouts-and-navigation.md) — header icons use the sprite
- [config-and-generators](config-and-generators.md) — `pnpm icons`
- [security-headers](security-headers.md) — external icon hosts need `img-src` allowance
