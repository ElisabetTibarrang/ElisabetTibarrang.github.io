#!/usr/bin/env node
// scripts/generate-security-headers.mjs

import fs from "node:fs/promises";
import path from "node:path";

import {
  securityOptions,
  securityHeaders,
  extraHttpHeaders,
  securityRouteGroups,
  getSecurityHeaders,
  getExtraHttpHeaders,
  serializeCsp,
} from "../src/config/security.mjs";


function buildHeaderBlock(route, csp, headers) {
  let block = `${route}\n`;

  if (csp && Object.keys(csp).length) {
    block += `  Content-Security-Policy: ${serializeCsp(csp)}\n`;
  }

  for (const [key, value] of Object.entries(headers || {})) {
    block += `  ${key}: ${value}\n`;
  }

  return `${block}\n`;
}

const runtimeMode = String(securityOptions.runtime?.mode || "server").toLowerCase();

if (runtimeMode !== "static") {
  console.log(`ℹ️ runtime.mode="${runtimeMode}". Skipping _headers generation.`);
  process.exit(0);
}

const writeToDist = process.argv.includes("--dist");

const outputFile = writeToDist
  ? path.join(process.cwd(), "dist", "_headers")
  : path.join(process.cwd(), "public", "_headers");

let output = "";

/* Default site rules */
output += buildHeaderBlock("/*", securityHeaders, extraHttpHeaders);

/* Route-specific rules */
for (const group of securityRouteGroups) {
  if (!group?.pattern) continue;

  const route = group.pattern.endsWith("/")
    ? `${group.pattern}*`
    : `${group.pattern}/*`;

  output += buildHeaderBlock(
    route,
    getSecurityHeaders("", group.pattern),
    getExtraHttpHeaders(group.pattern)
  );
}

await fs.mkdir(path.dirname(outputFile), { recursive: true });
await fs.writeFile(outputFile, output.trim() + "\n", "utf8");

console.log(
  `✅ Generated _headers → ${outputFile
    .replace(process.cwd(), ".")
    .replace(/\\/g, "/")}`
);

const verify = await fs.readFile(outputFile, "utf8");

if (!verify.includes("Content-Security-Policy")) {
  throw new Error("_headers generation failed. CSP missing.");
}

console.log("✅ _headers verification passed.");