#!/usr/bin/env node
// scripts/generate-wrangler.mjs

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import wranglerConfig from "../src/config/wrangler.mjs";

const root = process.cwd();

function fromRoot(...parts) {
  return path.join(root, ...parts);
}

function writeFile(file, content) {
  fs.writeFileSync(fromRoot(file), content, "utf8");
  console.log(`✓ wrote ${file}`);
}

function randomHex(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

function readKeyFromFile(filePath, key) {
  if (!fs.existsSync(filePath)) return null;

  const text = fs.readFileSync(filePath, "utf8");
  const re = new RegExp(
    String.raw`^${key}\s*=\s*"(.*)"\s*$|^${key}\s*=\s*([^\n\r]+)\s*$`,
    "m"
  );

  const match = text.match(re);
  if (!match) return null;

  return match[1] ?? match[2];
}

function loadOrGenerateSecret(varsFile, key) {
  const existing = readKeyFromFile(varsFile, key);
  if (existing && String(existing).trim()) return String(existing).trim();

  const value = randomHex(32);
  console.log(`🔑 Generated ${key}: ${value.slice(0, 8)}...(hidden)`);
  return value;
}

function cleanObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cleanObject).filter((v) => v !== undefined && v !== null);
  }

  if (!obj || typeof obj !== "object") return obj;

  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [key, cleanObject(value)])
      .filter(([, value]) => {
        if (value === undefined || value === null) return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === "object" && Object.keys(value).length === 0) return false;
        return true;
      })
  );
}

function normalizeKvNamespaces(kv) {
  if (!kv?.enabled) return [];

  return (Array.isArray(kv.namespaces) ? kv.namespaces : [])
    .filter((ns) => ns?.binding)
    .map((ns) => ({
      binding: String(ns.binding).trim(),
      id: String(ns.id || "").trim() || "REPLACE_KV_ID",
      preview_id: String(ns.preview_id || ns.id || "").trim() || "REPLACE_KV_PREVIEW_ID",
    }));
}

function normalizeR2Buckets(r2) {
  if (!r2?.enabled) return [];

  return (Array.isArray(r2.buckets) ? r2.buckets : [])
    .filter((bucket) => bucket?.binding && bucket?.bucket_name)
    .map((bucket) => ({
      binding: String(bucket.binding).trim(),
      bucket_name: String(bucket.bucket_name).trim(),
      ...(bucket.preview_bucket_name
        ? { preview_bucket_name: String(bucket.preview_bucket_name).trim() }
        : {}),
    }));
}

function buildWrangler() {
  const bindings = wranglerConfig.bindings || {};
  const d1 = bindings.d1 || {};
  const kvNamespaces = normalizeKvNamespaces(bindings.kv);
  const r2Buckets = normalizeR2Buckets(bindings.r2);
  const images = bindings.images || {};

  const baseD1 =
    d1.enabled
      ? [
          {
            binding: d1.binding || "DB",
            database_name: d1.database_name || "REPLACE_D1_NAME",
            database_id: d1.database_id || "REPLACE_D1_ID",
            migrations_dir: d1.migrations_dir || "migrations",
          },
        ]
      : [];

  const previewD1 =
    d1.enabled && (d1.preview_database_name || d1.preview_database_id)
      ? [
          {
            binding: d1.binding || "DB",
            database_name: d1.preview_database_name || d1.database_name || "REPLACE_D1_PREVIEW_NAME",
            database_id: d1.preview_database_id || d1.database_id || "REPLACE_D1_PREVIEW_ID",
            migrations_dir: d1.migrations_dir || "migrations",
          },
        ]
      : [];

  const wrangler = {
    ...(wranglerConfig.schema
      ? { $schema: wranglerConfig.schemaPath || "node_modules/wrangler/config-schema.json" }
      : {}),

    compatibility_date: wranglerConfig.compatibilityDate,
    compatibility_flags: wranglerConfig.compatibilityFlags || [],

    name: wranglerConfig.projectName || "astrowebtheme-free",
    main: wranglerConfig.main || "@astrojs/cloudflare/entrypoints/server",

    assets: wranglerConfig.assets || {
      directory: "./dist",
      binding: "ASSETS",
    },

    ...(Array.isArray(wranglerConfig.routes) && wranglerConfig.routes.length
      ? { routes: wranglerConfig.routes }
      : {}),

    ...(baseD1.length ? { d1_databases: baseD1 } : {}),
    ...(kvNamespaces.length ? { kv_namespaces: kvNamespaces } : {}),
    ...(r2Buckets.length ? { r2_buckets: r2Buckets } : {}),

    ...(images.enabled && images.binding
      ? { images: { binding: images.binding } }
      : {}),

    observability: {
      enabled: wranglerConfig.observability !== false,
    },

    ...(previewD1.length
      ? {
          env: {
            preview: {
              ...(previewD1.length ? { d1_databases: previewD1 } : {}),
            },
          },
        }
      : {}),
  };

  return cleanObject(wrangler);
}

function resolveSecretValue(varsPath, key, value) {
  // An existing value in .dev.vars always wins, so re-running this script never
  // replaces a real token with the placeholder from wrangler.mjs.
  const existing = readKeyFromFile(varsPath, key);
  if (existing && String(existing).trim()) {
    return String(existing).trim();
  }

  // string => use the configured value (placeholder or Turnstile test key)
  if (typeof value === "string") {
    return value;
  }

  // true => generate a random secret
  if (value === true) {
    const generated = randomHex(32);
    console.log(`🔑 Generated ${key}: ${generated.slice(0, 8)}...(hidden)`);
    return generated;
  }

  return "";
}

// KEY=value lines already in .dev.vars that wrangler.mjs does not manage.
function readUnmanagedLines(varsPath, managedKeys) {
  if (!fs.existsSync(varsPath)) return [];

  return fs
    .readFileSync(varsPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/);
      return match && !managedKeys.has(match[1]);
    });
}

function buildDevVars() {
  const varsPath = fromRoot(".dev.vars");
  const vars = wranglerConfig.localSecrets || {};

  const lines = [
    "# ────────────────────────────────────────────────────────────────",
    "# .dev.vars - LOCAL SECRETS ONLY",
    "# Written by scripts/generate-wrangler.mjs (existing values are kept)",
    "# DO NOT COMMIT",
    "# ────────────────────────────────────────────────────────────────",
    "",
  ];

  for (const [key, value] of Object.entries(vars)) {
    if (value === false || value == null) continue;

    const resolved = resolveSecretValue(varsPath, key, value);

    if (resolved) {
      lines.push(`${key}="${resolved}"`);
    }
  }

  const kept = readUnmanagedLines(varsPath, new Set(Object.keys(vars)));
  if (kept.length) {
    lines.push("", "# kept from your previous .dev.vars", ...kept);
  }

  return `${lines.join("\n")}\n`;
}

function main() {
  if (wranglerConfig.enabled === false) {
    console.log("Wrangler generation disabled.");
    return;
  }

  const wrangler = buildWrangler();

  const wranglerJsonc =
    `// AUTO-GENERATED by scripts/generate-wrangler.mjs
// Safe to commit. Does not include secrets.

` + JSON.stringify(wrangler, null, 2) + "\n";

  writeFile("wrangler.jsonc", wranglerJsonc);
  writeFile(".dev.vars", buildDevVars());

  console.log("Done. Generated wrangler.jsonc and .dev.vars.");
}

main();