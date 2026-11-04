// src/loaders/live.mjs
// AstroWEB v2 live loader stub.
// Keeps src/live.config.mjs valid for astro sync/build.
// Replace loader internals when D1 / WordPress / API live collections are enabled.

export function createLiveLoader(cfg = {}) {
  return {
    name: cfg?.source?.loaderKey || cfg?.source?.provider || "astroweb-live-loader",

    async loadCollection() {
      return {
        entries: [],
        cacheHint: {
          maxAge: cfg?.cacheTtl || 300,
          tags: [cfg?.base || "live"],
        },
      };
    },

    async loadEntry() {
      return {
        entry: undefined,
        cacheHint: {
          maxAge: cfg?.cacheTtl || 300,
          tags: [cfg?.base || "live"],
        },
      };
    },
  };
}