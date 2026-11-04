#!/usr/bin/env node
// scripts/check-docs.mjs
// Validates AGENTS.md, CLAUDE.md and docs/**/*.md: links, feature frontmatter,
// gap IDs, index coverage and size budgets. Exits 1 when there are errors.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const STATUSES = new Set(["working", "partial", "config-only", "scaffold"]);
const AGENTS_MAX_LINES = 150;
const FEATURE_MAX_LINES = 120;
const VERIFIED_RE = /^\d{4}-\d{2}-\d{2} @ [0-9a-f]{7,}$/;

const errors = [];
const warnings = [];

function fromRoot(...parts) {
  return path.join(root, ...parts);
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

function read(file) {
  return fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
}

function stripCode(text) {
  return text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
}

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;

  const data = { files: [] };
  let inFiles = false;

  for (const line of match[1].split("\n")) {
    const item = line.match(/^\s+-\s+(.+?)\s*$/);

    if (inFiles && item) {
      data.files.push(item[1]);
      continue;
    }

    const pair = line.match(/^([a-z-]+):\s*(.*?)\s*$/);
    if (!pair) continue;

    inFiles = pair[1] === "files";
    if (!inFiles) data[pair[1]] = pair[2];
  }

  return data;
}

function relatedStems(text) {
  const section = text.split(/^## Related\s*$/m)[1];
  if (!section) return null;

  const body = section.split(/^## /m)[0];
  const stems = new Set();

  for (const m of body.matchAll(/\]\(([^)\s#]+)\.md[^)]*\)/g)) {
    stems.add(path.basename(m[1]));
  }

  return stems;
}

for (const required of ["AGENTS.md", "CLAUDE.md", "docs/README.md", "docs/features/README.md", "docs/known-gaps.md"]) {
  if (!fs.existsSync(fromRoot(required))) errors.push(`${required}: missing`);
}

const docFiles = [fromRoot("AGENTS.md"), fromRoot("CLAUDE.md"), ...walk(fromRoot("docs"))].filter((f) =>
  fs.existsSync(f)
);

/* Links ------------------------------------------------------------------- */

for (const file of docFiles) {
  if (path.basename(file) === "_template.md") continue;

  const text = stripCode(read(file));

  for (const m of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;

    const resolved = path.resolve(path.dirname(file), target.split("#")[0]);
    if (!fs.existsSync(resolved)) errors.push(`${rel(file)}: broken link -> ${target}`);
  }
}

/* Size budgets ------------------------------------------------------------ */

const agentsFile = fromRoot("AGENTS.md");
if (fs.existsSync(agentsFile)) {
  const lines = read(agentsFile).split("\n").length;
  if (lines > AGENTS_MAX_LINES) errors.push(`AGENTS.md: ${lines} lines (budget ${AGENTS_MAX_LINES})`);
}

/* Gap IDs ----------------------------------------------------------------- */

const gapsFile = fromRoot("docs", "known-gaps.md");
const definedGaps = new Set();

if (fs.existsSync(gapsFile)) {
  for (const m of read(gapsFile).matchAll(/^\| (G\d+) \|/gm)) definedGaps.add(m[1]);
}

for (const file of docFiles) {
  for (const m of read(file).matchAll(/\bG\d+\b/g)) {
    if (!definedGaps.has(m[0])) errors.push(`${rel(file)}: unknown gap ${m[0]}`);
  }
}

/* Feature docs ------------------------------------------------------------ */

const featureDir = fromRoot("docs", "features");
const featureFiles = walk(featureDir).filter((f) => {
  const name = path.basename(f);
  return name !== "README.md" && name !== "_template.md";
});

const indexFile = path.join(featureDir, "README.md");
const indexText = fs.existsSync(indexFile) ? read(indexFile) : "";
const indexRows = new Map();

for (const line of indexText.split("\n")) {
  const m = line.match(/\|\s*(working|partial|config-only|scaffold)\s*\|\s*\[[^\]]+\]\(([^)]+?)\.md\)/);
  if (m) indexRows.set(m[2], m[1]);
}

const related = new Map();

for (const file of featureFiles) {
  const stem = path.basename(file, ".md");
  const text = read(file);
  const label = rel(file);

  const lineCount = text.split("\n").length;
  if (lineCount > FEATURE_MAX_LINES) warnings.push(`${label}: ${lineCount} lines (budget ${FEATURE_MAX_LINES})`);

  const fm = parseFrontmatter(text);
  if (!fm) {
    errors.push(`${label}: missing frontmatter`);
    continue;
  }

  if (fm.feature !== stem) errors.push(`${label}: frontmatter feature "${fm.feature}" != file name "${stem}"`);
  if (!STATUSES.has(fm.status)) errors.push(`${label}: invalid status "${fm.status}"`);
  if (!VERIFIED_RE.test(fm.verified || "")) errors.push(`${label}: verified must look like "2026-11-04 @ abc1234"`);
  if (!fm.files.length) errors.push(`${label}: files list is empty`);

  for (const f of fm.files) {
    if (!fs.existsSync(fromRoot(f))) errors.push(`${label}: files entry does not exist -> ${f}`);
  }

  if (!indexRows.has(stem)) {
    errors.push(`${label}: not listed in docs/features/README.md`);
  } else if (indexRows.get(stem) !== fm.status) {
    errors.push(`${label}: status "${fm.status}" differs from index "${indexRows.get(stem)}"`);
  }

  const stems = relatedStems(text);
  if (!stems || stems.size === 0) {
    errors.push(`${label}: needs a "## Related" section with at least one doc link`);
  } else {
    related.set(stem, stems);
  }
}

for (const [stem, stems] of related) {
  for (const other of stems) {
    if (other === "README" || other === "known-gaps") continue;

    if (!related.has(other)) {
      errors.push(`docs/features/${stem}.md: Related links to unknown feature doc "${other}"`);
    } else if (!related.get(other).has(stem)) {
      warnings.push(`docs/features/${stem}.md links to ${other}.md but not back`);
    }
  }
}

/* Report ------------------------------------------------------------------ */

for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);

console.log(
  `\ndocs_check: ${docFiles.length} files, ${featureFiles.length} feature docs, ` +
    `${errors.length} error(s), ${warnings.length} warning(s)`
);

process.exit(errors.length ? 1 : 0);
