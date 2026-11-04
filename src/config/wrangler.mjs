// src/config/wrangler.mjs
// Source for wrangler.jsonc and .dev.vars. Run `pnpm wrangler_json` after editing.
//
// The Free theme needs NO Cloudflare resources: no D1, no KV, no R2.
// The bindings below stay disabled and hold dummy values. Turn one on only if
// you add code that uses it, then replace the dummy values with the real ones
// from `wrangler d1 create`, `wrangler kv namespace create` or
// `wrangler r2 bucket create`.

export const wranglerConfig = {
  enabled: true,

  schema: false,
  schemaPath: "node_modules/wrangler/config-schema.json",

  // EDIT: the Worker name shown in the Cloudflare dashboard (lowercase, hyphens).
  // Worker names are per account, so the theme's own name is fine until you
  // pick yours. Cloudflare Workers Builds needs this to match the Worker name.
  projectName: "astrowebtheme-free",

  compatibilityDate: "2026-01-18",
  compatibilityFlags: ["global_fetch_strictly_public"],

  main: "@astrojs/cloudflare/entrypoints/server",

  assets: {
    directory: "./dist",
    binding: "ASSETS",
  },

  // ADD: custom domain routes, e.g.
  // [{ pattern: "example.com", custom_domain: true }]
  routes: [],

  observability: true,

  bindings: {
    d1: {
      enabled: false,
      binding: "DB",

      // EDIT when enabled: values printed by `wrangler d1 create <name>`.
      database_name: "REPLACE_WITH_D1_NAME",
      database_id: "00000000-0000-0000-0000-000000000000",

      preview_database_name: "",
      preview_database_id: "",

      migrations_dir: "migrations",
    },

    kv: {
      enabled: false,
      namespaces: [
        {
          binding: "KV_BINDING",

          // EDIT when enabled: ids printed by `wrangler kv namespace create`.
          name: "REPLACE_WITH_KV_NAME",
          id: "00000000000000000000000000000000",

          preview_name: "",
          preview_id: "",
        },
      ],
    },

    r2: {
      enabled: false,
      buckets: [
        {
          binding: "MEDIA_BUCKET",
          // EDIT when enabled: a bucket from `wrangler r2 bucket create`.
          bucket_name: "REPLACE_WITH_R2_BUCKET",
        },
      ],
    },

    images: {
      enabled: false,
      binding: "IMAGES",
    },
  },

  // Written to .dev.vars (local only, gitignored) by `pnpm wrangler_json`.
  // An existing value in .dev.vars is never overwritten, and keys that are not
  // listed here are kept.
  //
  // For the deployed Worker set the same names with
  //   wrangler secret put TENANT_ID
  //   wrangler secret put TENANT_API_TOKEN
  localSecrets: {
    // Only needed when the contact form is on (src/config/contact.mjs).
    // EDIT: contact form credentials from your email handler registration.
    // See docs/features/contact-form.md.
    TENANT_ID: "REPLACE_WITH_TENANT_ID",
    TENANT_API_TOKEN: "REPLACE_WITH_TOKEN",
  },
};

export default wranglerConfig;
