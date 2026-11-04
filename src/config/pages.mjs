// src/config/pages.mjs
// AstroWEB v2 + Astro v7 source of truth.
// Keep this file Node-safe: no astro:* imports here.
//
// Starter state: only the blog collection and the pages listed under `pages`
// are on. Everything you do not use is set to `false`:
//   - a collection with `enabled: false` gets no schema, routes or feed entries;
//   - a field collection (tags, categories, ...) with `enabled: false` is off;
//   - `taxonomy` / `relations` / `requests` keys set to false are not used here.
// To turn something on, flip it to `true`, add content under src/content/<dir>/
// and run `pnpm content_config`.

import { securityOptions } from "./security.mjs";

import {
  SOURCE_MODES,
  ROUTING_MODES,
  PAGINATION_MODES,
  PAGINATION_ROUTES,
  CONTENT_KINDS,
  CONTENT_TYPES,
  ENTITY_TYPES,
  LAYOUT_KEYS,
  CARD_KEYS,
} from "./constants.mjs";

const authEnabled = securityOptions?.auth?.enabled === true;
const authRoutes = securityOptions?.auth?.routes || {};

const staticSource = (dir) => ({
  mode: SOURCE_MODES.STATIC,
  dir,
  contentDir: `src/content/${dir}`,
  formats: ["md", "mdx"],
});

const dataSource = (dir) => ({
  mode: SOURCE_MODES.STATIC_DATA,
  dir,
  contentDir: `src/content/${dir}`,
  formats: ["json"],
});

const liveSource = (provider, loaderKey, options = {}) => ({
  mode: SOURCE_MODES.LIVE,
  provider,
  loaderKey,
  options,
});

const defaultPagination = {
  enabled: true,
  mode: PAGINATION_MODES.ASTRO,
  pageSize: 12,
  route: PAGINATION_ROUTES.PAGE_DIR,
};

const serverPagination = {
  enabled: true,
  mode: PAGINATION_MODES.QUERY,
  pageSize: 12,
};

const articleFeatures = {
  rss: true,
  sitemap: true,
  search: true,
  llms: true,
  faq: true,
  toc: true,
  related: true,
  prevNext: true,
  readingTime: true,
};

const noAssets = {
  gallery: false,
  downloads: false,
  attachments: false,
};

export const fieldCollections = {
  tags: {
    enabled: true,
    lock: false,
    label: "Tags",
    title: "Tags",
    description: "Tags used across content.",
    fieldName: "tags",
    meta: "tagMeta",
    maxPerEntry: 5,
    sitemapMinPosts: 5,
    param: "tag",
    llms: true,
    layout: { root: LAYOUT_KEYS.COLLECTION, entry: LAYOUT_KEYS.COLLECTION },
  },

  categories: {
    enabled: true,
    lock: false,
    label: "Categories",
    title: "Categories",
    description: "Categories used to group related content.",
    fieldName: "categories",
    meta: "categoryMeta",
    maxPerEntry: 3,
    sitemapMinPosts: 5,
    param: "category",
    llms: true,
    layout: { root: LAYOUT_KEYS.COLLECTION, entry: LAYOUT_KEYS.COLLECTION },
  },

  // Subjects/topics/fields only applied to the Pro-edition collections
  // (doc, resource, post, researcher-profile, publications), which are
  // disabled in the Free theme above. Flip to true if you enable those
  // collections and want the matching taxonomy archive pages.
  subjects: {
    enabled: false,
    lock: false,
    label: "Subjects",
    title: "Subjects",
    description: "Subjects used across academic/research content.",
    fieldName: "subjects",
    meta: "subjectMeta",
    maxPerEntry: 5,
    sitemapMinPosts: 5,
    param: "subject",
    llms: true,
    collections: [
      "blog",
      "doc",
      "resource",
      "post",
      "videos",
      "researcher-profile",
      "publications",
    ],
    layout: { root: LAYOUT_KEYS.COLLECTION, entry: LAYOUT_KEYS.COLLECTION },
  },

  topics: {
    enabled: false,
    lock: false,
    label: "Topics",
    title: "Topics",
    description: "Topics used to group related content.",
    fieldName: "topics",
    meta: "topicMeta",
    maxPerEntry: 5,
    sitemapMinPosts: 5,
    param: "topic",
    llms: true,
    collections: ["blog", "doc", "resource", "post", "publications"],
    layout: { root: LAYOUT_KEYS.COLLECTION, entry: LAYOUT_KEYS.COLLECTION },
  },

  fields: {
    enabled: false,
    lock: false,
    label: "Fields",
    title: "Fields",
    description: "Research fields used for academic content.",
    fieldName: "fields",
    meta: "fieldMeta",
    maxPerEntry: 5,
    sitemapMinPosts: 3,
    param: "field",
    llms: true,
    collections: ["researcher-profile", "publications"],
    layout: { root: LAYOUT_KEYS.COLLECTION, entry: LAYOUT_KEYS.COLLECTION },
  },
};

export const collections = {
  blog: {
    kind: CONTENT_KINDS.ARTICLE,
    contentType: CONTENT_TYPES.BLOG,
    entityType: ENTITY_TYPES.BLOG_POSTING,
    enabled: true,
    lock: false,
    base: "blog",
    dir: "blog",
    label: "Blog",
    title: "Blog",
    description: "Latest articles and updates.",
    source: staticSource("blog"),
    routing: { mode: ROUTING_MODES.STATIC, hasIndex: true, hasDetail: true, prerender: true },
    pagination: defaultPagination,
    // Only tags and categories are enabled in `fieldCollections` above.
    taxonomy: { tags: true, categories: true, subjects: false, topics: false },
    features: articleFeatures,
    // No team collection in the Free theme, so no author relation.
    relations: { team: false, related: true },
    assets: noAssets,
    layout: { list: LAYOUT_KEYS.COLLECTION, detail: LAYOUT_KEYS.POST, card: CARD_KEYS.POST, schema: "article" },
  },

  doc: {
    kind: CONTENT_KINDS.ARTICLE,
    contentType: CONTENT_TYPES.DOCUMENTATION,
    entityType: ENTITY_TYPES.TECH_ARTICLE,
    // Pro-edition collection. Flip to true and add content under
    // src/content/doc/ to enable (re-run `pnpm content_config` after).
    enabled: false,
    lock: false,
    base: "docs",
    dir: "doc",
    label: "Documentation",
    title: "Documentation",
    description: "Reference docs and how-to guides.",
    source: staticSource("doc"),
    routing: { mode: ROUTING_MODES.STATIC, hasIndex: true, hasDetail: true, prerender: true },
    subPages: true,
    subBase: { guides: {}, library: {}, components: {} },
    pagination: { ...defaultPagination, pageSize: 20 },
    taxonomy: { tags: true, categories: true, subjects: true, topics: true },
    features: articleFeatures,
    relations: { team: false, related: true },
    assets: noAssets,
    layout: { list: LAYOUT_KEYS.COLLECTION, detail: LAYOUT_KEYS.DOC, card: CARD_KEYS.POST, schema: "article" },
  },

  service: {
    kind: CONTENT_KINDS.SERVICE_ARTICLE,
    contentType: CONTENT_TYPES.SERVICE,
    entityType: ENTITY_TYPES.SERVICE,
    enabled: false,
    lock: false,
    base: "services",
    dir: "service",
    label: "Services",
    title: "Services",
    description: "Services and pricing packages.",
    source: staticSource("service"),
    routing: { mode: ROUTING_MODES.STATIC, hasIndex: true, hasDetail: true, prerender: true },
    pagination: defaultPagination,
    taxonomy: { tags: true, categories: true },
    features: { ...articleFeatures, offers: true },
    relations: { team: true, related: true },
    assets: noAssets,
    layout: { list: LAYOUT_KEYS.COLLECTION, detail: LAYOUT_KEYS.SERVICE, card: CARD_KEYS.SERVICE, schema: "service" },
  },

  resource: {
    kind: CONTENT_KINDS.ARTICLE,
    contentType: CONTENT_TYPES.RESOURCE,
    entityType: ENTITY_TYPES.ARTICLE,
    // Pro-edition collection. Flip to true and add content under
    // src/content/resource/ to enable (re-run `pnpm content_config` after).
    enabled: false,
    lock: false,
    base: "resources",
    dir: "resource",
    label: "Resources",
    title: "Resources",
    description: "Resource guides, templates, and checklists.",
    source: staticSource("resource"),
    routing: { mode: ROUTING_MODES.STATIC, hasIndex: true, hasDetail: true, prerender: true },
    pagination: defaultPagination,
    taxonomy: { tags: true, categories: true, topics: true },
    features: articleFeatures,
    relations: { team: true, related: true },
    assets: { ...noAssets, downloads: true },
    layout: { list: LAYOUT_KEYS.COLLECTION, detail: LAYOUT_KEYS.POST, card: CARD_KEYS.POST, schema: "article" },
  },

  post: {
    kind: CONTENT_KINDS.ARTICLE,
    contentType: CONTENT_TYPES.POST,
    entityType: ENTITY_TYPES.ARTICLE,
    // Pro-edition collection. Flip to true and add content under
    // src/content/post/ to enable (re-run `pnpm content_config` after).
    enabled: false,
    lock: false,
    base: "",
    aggregateBase: "posts",
    dir: "post",
    label: "Posts",
    title: "Posts",
    description: "Root-level general posts.",
    source: staticSource("post"),
    routing: {
      mode: ROUTING_MODES.STATIC,
      hasIndex: true,
      hasDetail: true,
      prerender: true,
      rootDetail: true,
    },
    pagination: defaultPagination,
    taxonomy: { tags: true, categories: true, subjects: true, topics: true },
    features: articleFeatures,
    relations: { team: false, related: true },
    assets: noAssets,
    layout: { list: LAYOUT_KEYS.COLLECTION, detail: LAYOUT_KEYS.POST, card: CARD_KEYS.POST, schema: "article" },
  },

  videos: {
    kind: CONTENT_KINDS.MEDIA_VIDEO,
    contentType: CONTENT_TYPES.VIDEO,
    entityType: ENTITY_TYPES.VIDEO_OBJECT,
    enabled: false,
    lock: false,
    base: "videos",
    dir: "videos",
    label: "Videos",
    title: "Videos",
    description: "Video content and watch pages.",
    source: staticSource("videos"),
    routing: { mode: ROUTING_MODES.STATIC, hasIndex: true, hasDetail: true, prerender: true },
    pagination: defaultPagination,
    taxonomy: { tags: true, categories: true, subjects: true },
    features: articleFeatures,
    relations: { team: false, related: true },
    assets: noAssets,
    layout: { list: LAYOUT_KEYS.COLLECTION, detail: LAYOUT_KEYS.VIDEO, card: CARD_KEYS.VIDEO, schema: "video" },
  },

  audio: {
    kind: CONTENT_KINDS.MEDIA_AUDIO,
    contentType: CONTENT_TYPES.AUDIO,
    entityType: ENTITY_TYPES.AUDIO_OBJECT,
    enabled: false,
    lock: false,
    base: "audio",
    dir: "audio",
    label: "Audio",
    title: "Audio",
    description: "Audio content and podcast episodes.",
    source: staticSource("audio"),
    routing: { mode: ROUTING_MODES.STATIC, hasIndex: true, hasDetail: true, prerender: true },
    pagination: defaultPagination,
    taxonomy: { tags: true, categories: true, subjects: true },
    features: articleFeatures,
    relations: { team: false, related: true },
    assets: noAssets,
    layout: { list: LAYOUT_KEYS.COLLECTION, detail: LAYOUT_KEYS.AUDIO, card: CARD_KEYS.AUDIO, schema: "audio" },
  },

  review: {
    kind: CONTENT_KINDS.REVIEW_DATA,
    contentType: CONTENT_TYPES.REVIEW,
    entityType: ENTITY_TYPES.REVIEW,
    // Pro-edition collection. Flip to true and add content under
    // src/content/review/ to enable (re-run `pnpm content_config` after).
    enabled: false,
    lock: false,
    base: "reviews",
    dir: "review",
    label: "Reviews",
    title: "Reviews",
    description: "Customer reviews and testimonials.",
    source: dataSource("review"),
    routing: { mode: ROUTING_MODES.STATIC, hasIndex: true, hasDetail: false, prerender: true },
    pagination: defaultPagination,
    taxonomy: {},
    features: { sitemap: false, rss: false, search: true, llms: true },
    relations: {},
    assets: noAssets,
    layout: { list: LAYOUT_KEYS.COLLECTION, detail: LAYOUT_KEYS.POST, card: CARD_KEYS.REVIEW, schema: "review" },
  },

  "researcher-profile": {
    kind: CONTENT_KINDS.RESEARCHER_PROFILE,
    contentType: CONTENT_TYPES.RESEARCH_PROFILE,
    entityType: ENTITY_TYPES.PERSON,
    // Pro-edition collection (no TeamLayout exists in the Free theme).
    // Flip to true and add content under src/content/researcher-profile/
    // to enable (re-run `pnpm content_config` after).
    enabled: false,
    lock: false,
    base: "researchers",
    dir: "researcher-profile",
    label: "Researchers",
    title: "Researchers",
    description: "Researcher profiles and academic CVs.",
    source: staticSource("researcher-profile"),
    routing: { mode: ROUTING_MODES.STATIC, hasIndex: true, hasDetail: true, prerender: true },
    pagination: { ...defaultPagination, pageSize: 9 },
    taxonomy: { tags: true, categories: true, subjects: true, fields: true },
    features: { sitemap: true, rss: false, search: true, llms: true, toc: true },
    relations: { team: false, related: false, publications: true },
    assets: { ...noAssets, gallery: true, downloads: true },
    layout: { list: LAYOUT_KEYS.COLLECTION, detail: LAYOUT_KEYS.TEAM, card: CARD_KEYS.PROFILE, schema: "person" },
  },

  publications: {
    kind: CONTENT_KINDS.PUBLICATION,
    contentType: CONTENT_TYPES.PUBLICATION,
    entityType: ENTITY_TYPES.SCHOLARLY_ARTICLE,
    // Pro-edition collection. Flip to true and add content under
    // src/content/publications/ to enable (re-run `pnpm content_config` after).
    enabled: false,
    lock: false,
    base: "publications",
    dir: "publications",
    label: "Publications",
    title: "Publications",
    description: "Research publications and scholarly outputs.",
    source: staticSource("publications"),
    routing: { mode: ROUTING_MODES.STATIC, hasIndex: true, hasDetail: true, prerender: true },
    pagination: defaultPagination,
    taxonomy: { tags: true, categories: true, subjects: true, topics: true, fields: true },
    features: { sitemap: true, rss: true, search: true, llms: true, toc: true },
    relations: { team: false, related: true, researcher: true },
    assets: { ...noAssets, downloads: true, attachments: true },
    layout: {
      list: LAYOUT_KEYS.COLLECTION,
      detail: LAYOUT_KEYS.PUBLICATION,
      card: CARD_KEYS.PUBLICATION,
      schema: "publication",
    },
    hasDetailPages: true,
    // Gated downloads need D1, R2 and KV. The Free theme uses none of them.
    requests: {
      enabled: false,
      requireD1: false,
      requireR2: false,
      useKvTokens: false,
      tokenTtlDays: 7,
      maxDownloads: 3,
      emailTemplate: "publication-download",
      defaultAsset: "pdf",
    },
  },

  livePosts: {
    kind: CONTENT_KINDS.LIVE_ARTICLE,
    contentType: CONTENT_TYPES.LIVE_POST,
    entityType: ENTITY_TYPES.ARTICLE,
    enabled: false,
    lock: false,
    base: "live",
    dir: "live-posts",
    label: "Live Posts",
    title: "Live Posts",
    description: "Runtime content from Cloudflare D1 or an API.",
    source: liveSource("cloudflare-d1", "d1ContentLoader", {
      table: "content_entries",
      type: "post",
    }),
    routing: { mode: ROUTING_MODES.SERVER, hasIndex: true, hasDetail: true, prerender: false },
    pagination: serverPagination,
    taxonomy: { tags: true, categories: true },
    features: { sitemap: false, rss: false, search: true, llms: false, faq: true, toc: true },
    relations: { team: true, related: true },
    assets: noAssets,
    layout: { list: LAYOUT_KEYS.COLLECTION, detail: LAYOUT_KEYS.POST, card: CARD_KEYS.POST, schema: "article" },
  },

  wpArticles: {
    kind: CONTENT_KINDS.LIVE_ARTICLE,
    contentType: CONTENT_TYPES.ARTICLE,
    entityType: ENTITY_TYPES.ARTICLE,
    enabled: false,
    lock: false,
    base: "articles",
    dir: "wp-articles",
    label: "Articles",
    title: "Articles",
    description: "Runtime articles from WordPress REST API.",
    source: liveSource("wordpress", "wordpressPostsLoader", {
      postType: "posts",
    }),
    routing: { mode: ROUTING_MODES.SERVER, hasIndex: true, hasDetail: true, prerender: false },
    pagination: serverPagination,
    taxonomy: { tags: true, categories: true },
    features: { sitemap: false, rss: false, search: true, llms: false, faq: true, toc: true },
    relations: { team: true, related: true },
    assets: noAssets,
    layout: { list: LAYOUT_KEYS.COLLECTION, detail: LAYOUT_KEYS.POST, card: CARD_KEYS.POST, schema: "article" },
  },
};

export const pages = {
  privacyPolicy: {
    label: "Privacy Policy",
    title: "Privacy Policy",
    description: "How we handle your information.",
    enabled: true,
    lock: false,
    index: true,
    sitemap: true,
    showInFooterNav: true,
    llms: "basic",
    path: "/privacy-policy/",
    location: "pages/privacy-policy.astro",
  },

  cookiePolicy: {
    label: "Cookie Policy",
    title: "Cookie Policy",
    description: "How we use cookies.",
    enabled: true,
    lock: false,
    index: true,
    sitemap: true,
    showInFooterNav: true,
    llms: "basic",
    path: "/cookie-policy/",
    location: "pages/cookie-policy.astro",
  },

  about: {
    label: "About Us",
    title: "About",
    description: "Who we are and how we help.",
    enabled: true,
    lock: false,
    index: true,
    sitemap: true,
    showInHeaderNav: true,
    showInFooterNav: true,
    llms: "full",
    path: "/about-us/",
    location: "pages/about-us.astro",
  },

  contact: {
    label: "Contact Us",
    title: "Contact",
    description: "Quotes, support, and quick help.",
    enabled: true,
    lock: false,
    index: true,
    sitemap: true,
    showInHeaderNav: true,
    showInFooterNav: true,
    llms: "basic",
    path: "/contact-us/",
    location: "pages/contact-us.astro",
  },

  terms: {
    label: "Terms & Conditions",
    title: "Terms & Conditions",
    description: "Legal terms for using our services.",
    enabled: true,
    lock: false,
    index: true,
    sitemap: true,
    showInFooterNav: true,
    llms: "basic",
    path: "/terms/",
    location: "pages/terms.astro",
  },

  // Off by default: a blog does not need a refund policy. This hides the page
  // from the footer, sitemap and llms.txt. The route file still exists at
  // src/pages/refund-policy.astro; delete it if you do not want the URL.
  refund: {
    label: "Refund Policy",
    title: "Refund Policy",
    description: "Refunds and cancellation terms.",
    enabled: false,
    lock: false,
    index: false,
    sitemap: false,
    showInFooterNav: false,
    llms: false,
    path: "/refund-policy/",
    location: "pages/refund-policy.astro",
  },

  search: {
    label: "Search",
    title: "Search",
    description: "Find guides, services, and resources.",
    enabled: true,
    lock: false,
    index: true,
    sitemap: false,
    showInHeaderNav: true,
    path: "/search/",
    location: "pages/search.astro",
  },

  cv: {
    label: "Curriculum Vitae",
    title: "Curriculum Vitae",
    description: "Individual researcher CV.",
    // Pro-edition / personal-site feature. No src/pages/cv.astro exists in
    // the Free theme. Flip to true and build the page to enable.
    enabled: false,
    lock: false,
    index: true,
    sitemap: true,
    showInHeaderNav: false,
    showInFooterNav: false,
    path: "/cv/",
    source: "site-content",
    contentDir: "src/site/content/cv",
    schema: true,
    print: true,
    downloads: true,
    location: "pages/cv.astro",
  },

  notFound: {
    label: "404 Not Found",
    title: "Page Not Found",
    description: "Try search or go home.",
    enabled: true,
    lock: false,
    index: false,
    sitemap: false,
    path: "/404/",
    location: "pages/404.astro",
  },

  login: {
    label: "Login",
    title: "Login",
    description: "Sign in.",
    enabled: authEnabled,
    lock: true,
    index: false,
    sitemap: false,
    path: authRoutes.login || "/auth/login/",
    location: "pages/auth/login.astro",
  },

  signup: {
    label: "Sign Up",
    title: "Create an account",
    description: "Register.",
    enabled: authEnabled,
    lock: true,
    index: false,
    sitemap: false,
    path: authRoutes.signup || "/auth/signup/",
    location: "pages/auth/signup.astro",
  },

  dashboard: {
    label: "Dashboard",
    title: "Dashboard",
    description: "Account overview.",
    enabled: authEnabled,
    lock: true,
    index: false,
    sitemap: false,
    path: authRoutes.dashboard || "/dashboard/",
    location: "pages/dashboard.astro",
  },
};

/**
 * @param {Record<string, any>} [raw]
 * @param {string} [key]
 * @returns {Record<string, any>}
 */
export function normalizePageFlags(raw = {}, key = "") {
  const enabled = typeof raw.enabled === "boolean" ? raw.enabled : true;
  const index = typeof raw.index === "boolean" ? raw.index : enabled;
  const sitemap = typeof raw.sitemap === "boolean" ? raw.sitemap : index;

  const llms =
    raw.llms === "basic" || raw.llms === "full" || raw.llms === true
      ? raw.llms
      : false;

  return {
    key,
    ...raw,
    enabled,
    index,
    sitemap,
    llms,
    showInFooterNav: raw.showInFooterNav === true,
    showInHeaderNav: raw.showInHeaderNav === true,
  };
}

export const allPagesNormalized = Object.fromEntries(
  Object.entries(pages).map(([key, value]) => [
    key,
    normalizePageFlags(value, key),
  ])
);