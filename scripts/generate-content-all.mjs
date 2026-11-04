#!/usr/bin/env node
// scripts/generate-content-all.mjs
// Manual v2 pipeline for Astro v7.

import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const run = (file) => {
  const res = spawnSync(process.execPath, [`scripts/${file}`, ...args], { stdio: 'inherit' });
  if (res.status !== 0) process.exit(res.status || 1);
};

run('generate-content-config.mjs');
run('generate-live-config.mjs');
run('scaffold-pages.mjs');
