// core/generators/generate-colors.mjs
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

const inputFile = path.join(rootDir, "src/config/colors.css");
const outputFile = path.join(rootDir, "src/styles/main/colors.css");

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readFileSafe(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing input file: ${filePath}`);
  }

  return fs.readFileSync(filePath, "utf8");
}

function normalizeCssValue(value = "") {
  return String(value).trim().replace(/;+$/g, "");
}

function isHex(value) {
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(String(value).trim());
}

function normalizeHex(hex) {
  const clean = String(hex || "").replace("#", "").trim();

  if (clean.length === 3) {
    return `#${clean
      .split("")
      .map((char) => char + char)
      .join("")}`.toLowerCase();
  }

  return `#${clean.slice(0, 6)}`.toLowerCase();
}

function colorOrFallback(value, fallback) {
  return isHex(value) ? normalizeHex(value) : fallback;
}

function filterOrFallback(value, fallback = "none") {
  const clean = normalizeCssValue(value);
  return clean || fallback;
}

function extractThemeBlock(css, theme) {
  const selectors =
    theme === "dark"
      ? ['\\[data-theme="dark"\\],\\s*\\.dark', "\\.dark"]
      : [':root,\\s*\\[data-theme="light"\\]', ":root"];

  for (const selector of selectors) {
    const regex = new RegExp(`${selector}\\s*{([\\s\\S]*?)}`, "m");
    const match = css.match(regex);

    if (!match) continue;

    const vars = {};
    const body = match[1];

    for (const found of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      vars[found[1]] = normalizeCssValue(found[2]);
    }

    return vars;
  }

  return {};
}

function hexToRgb(hex) {
  const clean = normalizeHex(hex).replace("#", "");

  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b]
    .map((value) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

function mix(hex1, hex2, weight = 0.5) {
  const a = hexToRgb(hex1);
  const b = hexToRgb(hex2);

  return rgbToHex({
    r: a.r * (1 - weight) + b.r * weight,
    g: a.g * (1 - weight) + b.g * weight,
    b: a.b * (1 - weight) + b.b * weight,
  });
}

function buildTheme(vars, mode) {
  const isDark = mode === "dark";
  const black = "#000000";
  const white = "#ffffff";

  const primary = colorOrFallback(vars["color-primary"], isDark ? "#d5b3ff" : "#a55aff");
  const secondary = colorOrFallback(vars["color-secondary"], isDark ? "#b4bcfd" : "#0516b9");
  const accent = colorOrFallback(vars["color-accent"], isDark ? "#fbbf24" : "#f59e0b");

  const success = colorOrFallback(vars["color-success"], isDark ? "#22c55e" : "#16a34a");
  const error = colorOrFallback(vars["color-error"], isDark ? "#f87171" : "#ef4444");
  const alert = colorOrFallback(vars["color-alert"], accent);
  const note = colorOrFallback(vars["color-note"], isDark ? "#60a5fa" : "#3b82f6");

  const filterPrimary = filterOrFallback(vars["filter-primary"]);
  const filterSecondary = filterOrFallback(vars["filter-secondary"]);

  const base = isDark
    ? {
        "00": black,
        "05": "#0d0d0d",
        10: "#1a1a1a",
        20: "#333333",
        30: "#4d4d4d",
        40: "#666666",
        50: "#808080",
        60: "#999999",
        70: "#b3b3b3",
        80: "#cccccc",
        90: "#e5e5e5",
        95: "#f2f2f2",
        100: white,
      }
    : {
        "00": white,
        "05": "#f2f2f2",
        10: "#e5e5e5",
        20: "#cccccc",
        30: "#b3b3b3",
        40: "#999999",
        50: "#808080",
        60: "#666666",
        70: "#4d4d4d",
        80: "#333333",
        90: "#1a1a1a",
        95: "#0d0d0d",
        100: black,
      };

  const primaryScale = isDark
    ? {
        "darker-x": mix(primary, white, 0.88),
        darker: mix(primary, white, 0.68),
        dark: mix(primary, white, 0.42),
        light: mix(primary, black, 0.18),
        lighter: mix(primary, black, 0.36),
        "lighter-x": mix(primary, black, 0.62),
      }
    : {
        "darker-x": mix(primary, black, 0.68),
        darker: mix(primary, black, 0.48),
        dark: mix(primary, black, 0.24),
        light: mix(primary, white, 0.32),
        lighter: mix(primary, white, 0.78),
        "lighter-x": mix(primary, white, 0.92),
      };

  const secondaryScale = isDark
    ? {
        "darker-x": mix(secondary, white, 0.9),
        darker: mix(secondary, white, 0.72),
        dark: mix(secondary, white, 0.46),
        light: mix(secondary, black, 0.18),
        lighter: mix(secondary, black, 0.36),
        "lighter-x": mix(secondary, black, 0.62),
      }
    : {
        "darker-x": mix(secondary, black, 0.72),
        darker: mix(secondary, black, 0.52),
        dark: mix(secondary, black, 0.26),
        light: mix(secondary, white, 0.38),
        lighter: mix(secondary, white, 0.72),
        "lighter-x": mix(secondary, white, 0.9),
      };

  const filterBlack = "brightness(0) saturate(100%)";
  const filterWhite = "brightness(0) invert(1)";

  return `
  --primary-darker-x: ${primaryScale["darker-x"]};
  --primary-darker: ${primaryScale.darker};
  --primary-dark: ${primaryScale.dark};
  --primary-base: var(--color-primary);
  --primary-light: ${primaryScale.light};
  --primary-lighter: ${primaryScale.lighter};
  --primary-lighter-x: ${primaryScale["lighter-x"]};

  --secondary-darker-x: ${secondaryScale["darker-x"]};
  --secondary-darker: ${secondaryScale.darker};
  --secondary-dark: ${secondaryScale.dark};
  --secondary-base: var(--color-secondary);
  --secondary-light: ${secondaryScale.light};
  --secondary-lighter: ${secondaryScale.lighter};
  --secondary-lighter-x: ${secondaryScale["lighter-x"]};

  --accent-base: var(--color-accent);
  --secondary: var(--secondary-base);

  --base-00: ${base["00"]};
  --base-05: ${base["05"]};
  --base-10: ${base[10]};
  --base-20: ${base[20]};
  --base-30: ${base[30]};
  --base-40: ${base[40]};
  --base-50: ${base[50]};
  --base-60: ${base[60]};
  --base-70: ${base[70]};
  --base-80: ${base[80]};
  --base-90: ${base[90]};
  --base-95: ${base[95]};
  --base-100: ${base[100]};

  --success-light: ${isDark ? mix(success, black, 0.55) : mix(success, white, 0.82)};
  --success: var(--color-success);
  --success-dark: ${isDark ? mix(success, white, 0.82) : mix(success, black, 0.55)};

  --error-light: ${isDark ? mix(error, black, 0.55) : mix(error, white, 0.82)};
  --error: var(--color-error);
  --error-dark: ${isDark ? mix(error, white, 0.82) : mix(error, black, 0.55)};

  --alert-light: ${isDark ? mix(alert, black, 0.55) : mix(alert, white, 0.82)};
  --alert: var(--color-alert);
  --alert-dark: ${isDark ? mix(alert, white, 0.82) : mix(alert, black, 0.55)};

  --note-light: ${isDark ? mix(note, black, 0.55) : mix(note, white, 0.82)};
  --note: var(--color-note);
  --note-dark: ${isDark ? mix(note, white, 0.82) : mix(note, black, 0.55)};

  --filter-black: ${filterBlack};
  --filter-white: ${filterWhite};
  --filter-primary: ${filterPrimary};
  --filter-secondary: ${filterSecondary};
  --filter-base: ${isDark ? filterWhite : filterBlack};
  --filter-base-invert: ${isDark ? filterBlack : filterWhite};
`;
}

function buildCss() {
  const configCss = readFileSafe(inputFile);

  const lightVars = extractThemeBlock(configCss, "light");
  const darkVars = extractThemeBlock(configCss, "dark");

  return `/* ==========================================
   AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.

   Source:
   src/config/colors.css

   Generated by:
   core/generators/generate-colors.mjs
========================================== */

${configCss.trim()}

/* ================================
   Derived theme color tokens
================================ */

:root,
[data-theme="light"] {${buildTheme(lightVars, "light")}
}

[data-theme="dark"],
.dark {${buildTheme({ ...lightVars, ...darkVars }, "dark")}
}

/* ================================
   Modern dynamic HSL overrides
================================ */

@supports (color: hsl(from red h s l)) {
  :root,
  [data-theme="light"] {
    --primary-darker-x: hsl(from var(--color-primary) h s 18%);
    --primary-darker: hsl(from var(--color-primary) h s 28%);
    --primary-dark: hsl(from var(--color-primary) h s 42%);
    --primary-base: var(--color-primary);
    --primary-light: hsl(from var(--color-primary) h s 75%);
    --primary-lighter: hsl(from var(--color-primary) h s 92%);
    --primary-lighter-x: hsl(from var(--color-primary) h s 96%);

    --secondary-darker-x: hsl(from var(--color-secondary) h s 10%);
    --secondary-darker: hsl(from var(--color-secondary) h s 18%);
    --secondary-dark: hsl(from var(--color-secondary) h s 28%);
    --secondary-base: var(--color-secondary);
    --secondary-light: hsl(from var(--color-secondary) h s 70%);
    --secondary-lighter: hsl(from var(--color-secondary) h s 84%);
    --secondary-lighter-x: hsl(from var(--color-secondary) h s 94%);
  }

  [data-theme="dark"],
  .dark {
    --primary-darker-x: hsl(from var(--color-primary) h s 92%);
    --primary-darker: hsl(from var(--color-primary) h s 82%);
    --primary-dark: hsl(from var(--color-primary) h s 74%);
    --primary-base: var(--color-primary);
    --primary-light: hsl(from var(--color-primary) h s 52%);
    --primary-lighter: hsl(from var(--color-primary) h s 38%);
    --primary-lighter-x: hsl(from var(--color-primary) h s 24%);

    --secondary-darker-x: hsl(from var(--color-secondary) h s 94%);
    --secondary-darker: hsl(from var(--color-secondary) h s 84%);
    --secondary-dark: hsl(from var(--color-secondary) h s 74%);
    --secondary-base: var(--color-secondary);
    --secondary-light: hsl(from var(--color-secondary) h s 52%);
    --secondary-lighter: hsl(from var(--color-secondary) h s 38%);
    --secondary-lighter-x: hsl(from var(--color-secondary) h s 24%);
  }
}

/* ================================
   Filter utilities
   For mono img/url icons only
================================ */

.filter-none {
  filter: none;
}

.filter-black {
  filter: var(--filter-black);
}

.filter-white {
  filter: var(--filter-white);
}

.filter-primary {
  filter: var(--filter-primary);
}

.filter-secondary {
  filter: var(--filter-secondary);
}

.filter-base {
  filter: var(--filter-base);
}

.filter-base-invert {
  filter: var(--filter-base-invert);
}
`
    .replace(/\n{3,}/g, "\n\n")
    .trim() + "\n";
}

function main() {
  const css = buildCss();

  ensureDir(outputFile);
  fs.writeFileSync(outputFile, css, "utf8");

  console.log(`Generated ${path.relative(rootDir, outputFile)}`);
}

main();