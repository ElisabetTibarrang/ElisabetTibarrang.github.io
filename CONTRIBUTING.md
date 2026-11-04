# Contributing

Thank you for helping! This page explains how to report a problem, how we handle issues and how to send a change.

## Reporting a problem or asking for something

1. **Read the docs first.** Every feature has a short page in [`docs/features/`](docs/features/README.md). Known problems are listed in [`docs/known-gaps.md`](docs/known-gaps.md).
2. **Search the [issues](https://github.com/nviewsweb/astrowebtheme-free/issues)**, open and closed. Add a comment if your problem is already there.
3. **Open a new issue** with the form that fits: bug report, feature request or question. Fill in every field. The more exact you are, the faster we can help.
4. **One problem per issue.** Security problems go to [`SECURITY.md`](SECURITY.md), not here.

A good bug report has: what you did, what you expected, what happened, the output of `node -v` and `pnpm -v`, and whether it happens in `pnpm dev`, after `pnpm build`, or only on your deployed site.

## How we handle issues

| Step | What happens | Target |
| --- | --- | --- |
| Triage | A maintainer reads the issue and adds a label. If details are missing we ask for them. | within 7 days |
| Confirm | We try to reproduce it. A confirmed bug gets the `bug` label; a missing feature gets `enhancement`. | within 14 days |
| Fix | Bugs are fixed in the next release. Gaps we will not fix soon are added to `docs/known-gaps.md` with an ID. | next release |
| Release | The fix is listed in [`CHANGELOG.md`](CHANGELOG.md) and the issue is closed with a link to the change. | with the release |

Labels we use: `bug`, `enhancement`, `question`, `docs`, `good first issue`, `help wanted`, `wontfix` and `out of scope`.

Issues without the details we asked for are closed after 30 days. You can always reopen them.

## What is in scope

This is a small theme for content sites: blog, pages, search, feeds, a contact form, light and dark mode, and secure defaults. Features that need accounts, databases, dashboards or paid services are out of scope. We keep the theme small on purpose, so we may close an enhancement with `out of scope` even if it is a good idea.

## Sending a change

1. Fork the repository and create a branch from `main`.
2. `pnpm install` (Node 22.12 or newer, pnpm 11).
3. Make your change. Change config before code; follow [`AGENTS.md`](AGENTS.md) for the rules of this repository.
4. Check it:

   ```bash
   pnpm check        # type check: must report 0 errors
   pnpm build        # must pass
   pnpm docs_check   # docs links and frontmatter
   ```

5. Update the feature doc in `docs/features/` and `CHANGELOG.md` if behaviour changed.
6. Open a pull request. Say what changed and why, and link the issue. Small pull requests are reviewed faster.

Use short, imperative commit messages ("Fix search on Enter"). Do not commit `.dev.vars`, `.env` or generated build output.

## Code of conduct

By taking part you agree to the [Code of conduct](CODE_OF_CONDUCT.md).
