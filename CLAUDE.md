@AGENTS.md

# Claude Code notes

Everything shared with other agents is in `AGENTS.md` (imported above). Only Claude Code specifics are here.

## Running and checking

- `.claude/launch.json` defines the dev server `astrowebtheme-free-dev` (port 4321) for preview tooling. Start it that way rather than running `pnpm dev` through Bash.
- To verify a UI change, prefer the accessibility tree, console and network output over screenshots. Take a screenshot only as final proof.

## Context window

- Do not `@`-import feature docs. They are linked, not imported, so they load only when you open the one you need.
- Do not open the paths listed under "Do not read" in `AGENTS.md`.
- For questions that span many files ("where is X used?"), use a search/Explore subagent and take its conclusion, not the file dumps.
- Before editing a feature, read `docs/features/<feature>.md`. Its `files:` frontmatter lists the only files you normally need.

## Memory

- Save to memory: user preferences, decisions and constraints that are not in the repo.
- Do not save to memory: file locations, how a feature works, or known gaps. Put those in `docs/features/*` or `docs/known-gaps.md` so every agent sees them.
- If a memory contradicts the docs, check the code and fix whichever is wrong.

## Compact instructions

When compacting, keep: the task and acceptance criteria, files changed so far, the feature doc being edited, the last failing command and its error, and any decision the user made. Drop file dumps and exploratory reads.
