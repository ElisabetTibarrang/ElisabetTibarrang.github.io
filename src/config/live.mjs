// src/config/live.mjs
// Optional explicit live collections.
// Usually, live collections can also be declared directly in src/config/pages.mjs.
// This file is useful for provider-specific runtime collections.

import {
  SOURCE_MODES,
  ROUTING_MODES,
  PAGINATION_MODES,
  CONTENT_KINDS,
  CONTENT_TYPES,
  ENTITY_TYPES,
  LAYOUT_KEYS,
  CARD_KEYS,
} from "./constants.mjs";

const liveSource = (provider, loaderKey, options = {}) => ({
  mode: SOURCE_MODES.LIVE,
  provider,
  loaderKey,
  options,
});

const serverPagination = {
  enabled: true,
  mode: PAGINATION_MODES.QUERY,
  pageSize: 12,
};

export const liveCollections = {
  d1Posts: {
    kind: CONTENT_KINDS.LIVE_ARTICLE,
    contentType: CONTENT_TYPES.LIVE_POST,
    entityType: ENTITY_TYPES.ARTICLE,
    enabled: false,
    lock: false,
    base: "live",
    dir: "d1-posts",
    label: "D1 Posts",
    title: "D1 Posts",
    description: "Runtime content from Cloudflare D1.",
    source: liveSource("cloudflare-d1", "d1ContentLoader", {
      table: "content_entries",
      type: "post",
    }),
    routing: {
      mode: ROUTING_MODES.SERVER,
      hasIndex: true,
      hasDetail: true,
      prerender: false,
    },
    pagination: serverPagination,
    taxonomy: {
      tags: true,
      categories: true,
    },
    features: {
      sitemap: false,
      rss: false,
      search: true,
      llms: false,
      faq: true,
      toc: true,
    },
    relations: {
      team: true,
      related: true,
    },
    assets: {
      gallery: false,
      downloads: false,
      attachments: false,
    },
    layout: {
      list: LAYOUT_KEYS.COLLECTION,
      detail: LAYOUT_KEYS.POST,
      card: CARD_KEYS.POST,
      schema: "article",
    },
    schema: "liveArticleSchema",
  },

  wordpressPosts: {
    kind: CONTENT_KINDS.LIVE_ARTICLE,
    contentType: CONTENT_TYPES.ARTICLE,
    entityType: ENTITY_TYPES.ARTICLE,
    enabled: false,
    lock: false,
    base: "articles",
    dir: "wordpress-posts",
    label: "WordPress Posts",
    title: "WordPress Posts",
    description: "Runtime posts from WordPress REST API.",
    source: liveSource("wordpress", "wordpressPostsLoader", {
      postType: "posts",
    }),
    routing: {
      mode: ROUTING_MODES.SERVER,
      hasIndex: true,
      hasDetail: true,
      prerender: false,
    },
    pagination: serverPagination,
    taxonomy: {
      tags: true,
      categories: true,
    },
    features: {
      sitemap: false,
      rss: false,
      search: true,
      llms: false,
      faq: true,
      toc: true,
    },
    relations: {
      team: true,
      related: true,
    },
    assets: {
      gallery: false,
      downloads: false,
      attachments: false,
    },
    layout: {
      list: LAYOUT_KEYS.COLLECTION,
      detail: LAYOUT_KEYS.POST,
      card: CARD_KEYS.POST,
      schema: "article",
    },
    schema: "liveArticleSchema",
  },
};