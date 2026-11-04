# Docs map

Agent-facing documentation for AstroWebTheme Free. Human-facing setup is in the root `README.md`.

```text
AGENTS.md                  Entry point for every agent. Short; links here.
CLAUDE.md                  Imports AGENTS.md; Claude Code specifics only.
docs/README.md             This file: structure, conventions, upkeep.
docs/features/README.md    Feature index: status table and "I want to…" routing.
docs/features/<feature>.md One doc per feature (template: docs/features/_template.md).
docs/known-gaps.md         Single list of unfinished wiring and problems (IDs G1…).
```

## How the pieces link

```text
AGENTS.md ──▶ docs/features/README.md ──▶ docs/features/<feature>.md ──▶ related feature docs
    │                                              │
    ├──▶ docs/README.md (rules)                    └──▶ docs/known-gaps.md#<ID>
    └──▶ docs/known-gaps.md ◀── lists the feature docs each gap touches
```

- Every feature doc is listed in `docs/features/README.md`; `pnpm docs_check` fails otherwise.
- Feature docs link to each other under `## Related`, in both directions.
- Gaps are defined once in `docs/known-gaps.md` and referenced by ID (`G3`) elsewhere. Do not restate them.
- Use relative links for doc-to-doc references. Name source files in backticks, without line numbers.

## Conventions for a feature doc

Copy `docs/features/_template.md`. Required frontmatter:

```yaml
---
feature: kebab-case-name          # matches the filename
status: working | partial | config-only | scaffold
files:                            # source of truth; each path must exist
  - src/path/to/file
verified: 2026-11-04 @ 355e3e9    # date and commit the doc was last checked against code
---
```

Status meanings: `working` = shipped and wired; `partial` = works with documented limits; `config-only` = options exist but nothing consumes them yet; `scaffold` = stub kept for the Pro edition.

Sections, in order: What it does · Configure · How it works · Common tasks · Verify · Gotchas · Related.
Keep each doc under ~120 lines. If it grows past that, split by sub-feature rather than adding more text.

## Keeping docs current (do this in the same change as the code)

1. Changed behaviour of a feature → update its doc and bump `verified:`.
2. Fixed a gap → delete it from `docs/known-gaps.md` and from the feature doc's Gotchas; change `status` if it moved.
3. Found a new gap → add it to `docs/known-gaps.md` with the next free ID and link the feature docs it touches.
4. New feature → new doc from the template, plus a row in `docs/features/README.md`.
5. Renamed or deleted a file → fix every `files:` entry and link that mentions it.
6. Run `pnpm docs_check` before finishing.

## Context budget (why the docs are shaped this way)

- `AGENTS.md` is loaded in every session: keep it under 150 lines (checked by `pnpm docs_check`).
- Feature docs are loaded one at a time, on demand. They say where things are and what is surprising, not what the code already shows.
- Prefer a table or a short list over prose. Put the answer to "what do I run / which file do I edit" first.
