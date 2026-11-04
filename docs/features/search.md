---
feature: search
status: partial
files:
  - src/pages/search.astro
  - src/styles/components/search.css
  - src/styles/components/search-icon.css
  - src/components/header/SearchButton.astro
  - src/config/pages.mjs
verified: 2026-11-04 @ 355e3e9
---

# Search

A client-side search page with no external service. It covers blog posts only.

## What it does

- `/search/` builds a JSON index of every visible blog post (`title`, `description`, `url`) at build time and inlines it in the page (`<script type="application/json" id="search-index">`).
- A small script filters the index as you type: case-insensitive substring match on title and description. `?q=term` pre-fills and runs a search.
- The form has a **Search** button and an autofocused box. Enter and the button run the same search through a `submit` listener (no inline handler) and keep the query in the URL (`?q=`).
- Results and the count are announced through an `aria-live` status line.
- The page is `noindex` and excluded from the sitemap; the header shows a search icon button linking to it.

## Configure

| Option | File | Effect |
| --- | --- | --- |
| `search` page: `enabled`, `showInHeaderNav`, copy | `src/config/pages.mjs` | Page and header icon |
| Collection `features.search` | `src/config/pages.mjs` | Declared, not read by the page |

## Common tasks

1. **Add another collection to the index:** in `search.astro`, build entries from `getVisibleCollection("<key>")` with `getEntryUrl("<key>", entry)` and append them to `searchIndex` (G13).
2. **Search body text or tags:** add the fields to `searchIndex` and to the `filter` in the inline script; mind the index size, since it ships in every `/search/` response.
3. **Change the placeholder or labels:** edit the markup in `search.astro`.

## Verify

Run `pnpm dev`, open `/search/?q=astro`; the example post should be listed. Clear the box: results disappear and the status shows the indexed count.

## Gotchas

- Only title and description are searched, not the article body or tags.
- Posts with `index: false` are still searchable (G17).
- Never put `onsubmit="return false"` back on the form: the CSP sets `script-src-attr 'none'`, so the attribute is ignored in production and Enter would reload the page and clear the results. The form is handled by a `submit` listener instead.
- `autofocus` can be ignored by the browser if the page does not have focus; clicking the box always works.
- Blog only (G13).

## Related

- [content-editing](content-editing.md) — the fields being indexed
- [security-headers](security-headers.md) — `script-src-attr` and nonces
- [layouts-and-navigation](layouts-and-navigation.md) — the header search button
- [collections](collections.md) — `getVisibleCollection` and `getEntryUrl`
