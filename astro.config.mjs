// astro.config.mjs
// @ts-check
import { defineConfig, sessionDrivers } from "astro/config";
import mdx from "@astrojs/mdx";
import cloudflare from "@astrojs/cloudflare";
import { Features } from "lightningcss";

import brandConfig from "./src/config/brand.mjs";
import { securityOptions } from "./src/config/security.mjs";

// One switch: src/config/security.mjs -> runtime.mode ("static" | "server").
// Static builds prerender every page; only routes that export
// `prerender = false` (src/pages/api/contact.ts) run on the Worker.
const output = securityOptions.runtime?.mode === "server" ? "server" : "static";

export default defineConfig({
  // Set your real domain in src/config/brand.mjs -> siteUrl.
  site: brandConfig.siteUrl,
  output,
  trailingSlash: "always",

  integrations: [mdx()],

  adapter: cloudflare({
    imageService: "compile",
  }),

  // This theme does not use Astro sessions. Without a driver the Cloudflare
  // adapter adds a KV binding named SESSION (and `wrangler deploy` would create
  // a namespace for it). To use sessions, switch to
  // sessionDrivers.cloudflareKVBinding() and add a KV namespace in
  // src/config/wrangler.mjs.
  session: {
    // "memory" exists at runtime but is missing from Astro's type declarations.
    driver: /** @type {any} */ (sessionDrivers).memory(),
  },

  vite: {
    css: {
      // Enables inline source maps for your CSS in the browser
      devSourcemap: true,
      // Sets Lightning CSS as the primary CSS transformer
      transformer: "lightningcss",
      lightningcss: {
        // Allows the build to skip over invalid rules and just warn
        errorRecovery: true,
        // Optional: specify what features you want (e.g., only native nesting)
        include: Features.Nesting,
      },
    },
    build: {
      cssMinify: "lightningcss",
      // Never inline scripts or assets into pages. The CSP (script-src 'self',
      // img-src 'self') blocks inline module scripts and data: URIs.
      assetsInlineLimit: 0,
    },
  },
});
