// src/config/security.mjs
// Node-safe. No "@/..." imports.

/* ==========================================================================
   SECURITY OPTIONS
   ========================================================================== */

export const securityOptions = {

  // "static"  -> prerendered site; astro.config.mjs sets output: "static" and
  //              `pnpm build` writes public/_headers (CSP cannot use a nonce here).
  //              Only src/pages/api/contact.ts runs on the Worker.
  // "server"  -> every page rendered per request; middleware adds a nonce CSP.
  runtime: {
    mode: "static", // "static" | "server"
  },

  hsts: {
    enabled: true,
    value: "max-age=31536000; includeSubDomains; preload",
  },

  csp: {
    reportOnlyInDev: true,
    reportUri: "",

    // Static _headers cannot use per-request nonce.
    // Keep style inline only if you use inline BaseCss/Fonts/Variables in static mode.
    staticAllowInlineStyle: true,
    staticAllowInlineScript: false,
  },

  features: {
    googleAnalytics: false,
    googleTagManager: false,
    cloudflareAnalytics: false,
    cloudflareRum: false,
    turnstile: false,
    adsense: false,
    googleFonts: false,
    youtube: false,
    vimeo: false,
    productHunt: false,
    gravatar: false,
  },

  // Optional CSP violation collector. Leave "" to disable.
  // To enable, paste the https URL of your report endpoint here, e.g.
  // "https://csp-reports.example.com/report", then run `pnpm security_headers`.
  // (The contact form handler is configured in src/config/contact.mjs; it is
  // called from the Worker, so the browser CSP does not need to allow it.)
  endpoints: {
    cspReportHandler: "",
  },

 auth: {
    enabled: false,
    devBypass: false,
    routes: {
        login: "/auth/login",
        signup: "/auth/signup",
        logout: "/api/auth/logout",
        dashboard: "/dashboard",
        account: "/account",
        setupAccount: "/auth/setup-account",
        totp: "/auth/totp",
        forgotPassword: "/auth/forgot-password",
        resetPassword: "/auth/reset-password",
        recoverMfa: "/auth/recover-mfa",
    },
    },
};

/* ==========================================================================
   HELPERS
   ========================================================================== */

const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

const add = (dst, key, values) => {
  if (!values?.length) return;
  const prev = Array.isArray(dst[key]) ? dst[key] : [];
  dst[key] = uniq([...prev, ...values]);
};

const originOf = (url) => {
  try {
    return url ? new URL(url).origin : "";
  } catch {
    return "";
  }
};

const normalizePrefix = (route, fallback) => {
  if (!route || typeof route !== "string") return fallback;
  const match = route.match(/^\/[^/]+\//);
  return match?.[0] || fallback;
};

function cloneDirectives(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* ==========================================================================
   CSP BASE
   ========================================================================== */

const BASE_CSP = {
  "default-src": ["'none'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  "manifest-src": ["'self'"],
  "worker-src": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],

  "connect-src": ["'self'"],
  "img-src": ["'self'"],
  "font-src": ["'self'"],
  "media-src": ["'self'"],

  "script-src": ["'self'", "'report-sample'"],
  "script-src-elem": ["'self'"],
  "script-src-attr": ["'none'"],

  "style-src": ["'self'", "'report-sample'"],

  "frame-src": ["'self'"],

  "upgrade-insecure-requests": true,
};

function buildDirectivesBase() {
  const h = cloneDirectives(BASE_CSP);
  const { features, endpoints, csp } = securityOptions;

  const cspReportOrigin = originOf(endpoints.cspReportHandler || csp.reportUri);

  if (cspReportOrigin) {
    h["report-uri"] = cspReportOrigin;
  }

  if (features.googleAnalytics) {
    add(h, "connect-src", [
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://*.google-analytics.com",
      "https://*.googletagmanager.com",
    ]);
    add(h, "img-src", [
      "https://www.google-analytics.com",
      "https://*.googletagmanager.com",
    ]);
    add(h, "script-src", ["https://www.googletagmanager.com"]);
  }

  if (features.googleTagManager) {
    add(h, "connect-src", [
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://*.google-analytics.com",
      "https://*.googletagmanager.com",
    ]);
    add(h, "img-src", [
      "https://www.googletagmanager.com",
      "https://*.googletagmanager.com",
    ]);
    add(h, "script-src", [
      "https://www.googletagmanager.com",
      "https://tagmanager.google.com",
    ]);
    add(h, "frame-src", ["https://www.googletagmanager.com"]);
  }

  if (features.cloudflareAnalytics || features.cloudflareRum) {
    add(h, "connect-src", [
      "https://static.cloudflareinsights.com",
      "https://cloudflareinsights.com",
    ]);
    add(h, "img-src", ["https://cloudflareinsights.com"]);
    add(h, "script-src", ["https://static.cloudflareinsights.com"]);
  }

  if (features.turnstile) {
    add(h, "connect-src", ["https://challenges.cloudflare.com"]);
    add(h, "script-src", ["https://challenges.cloudflare.com"]);
    add(h, "frame-src", ["https://challenges.cloudflare.com"]);
  }

  if (features.adsense) {
    add(h, "connect-src", [
      "https://googleads.g.doubleclick.net",
      "https://pagead2.googlesyndication.com",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://securepubads.g.doubleclick.net",
      "https://www.googleadservices.com",
      "https://adservice.google.com",
    ]);
    add(h, "img-src", [
      "https://pagead2.googlesyndication.com",
      "https://googleads.g.doubleclick.net",
      "https://tpc.googlesyndication.com",
    ]);
    add(h, "media-src", [
      "https://video-ad-stats.googlesyndication.com",
      "https://storage.googleapis.com",
    ]);
    add(h, "script-src", [
      "https://pagead2.googlesyndication.com",
      "https://googleads.g.doubleclick.net",
      "https://www.googletagservices.com",
    ]);
    add(h, "frame-src", [
      "https://*.googlesyndication.com",
      "https://*.doubleclick.net",
    ]);
  }

  if (features.googleFonts) {
    add(h, "style-src", ["https://fonts.googleapis.com"]);
    add(h, "font-src", ["https://fonts.gstatic.com"]);
  }

  if (features.youtube) {
    add(h, "media-src", ["https://www.youtube.com"]);
    add(h, "frame-src", ["https://www.youtube.com"]);
  }

  if (features.vimeo) {
    add(h, "media-src", ["https://player.vimeo.com"]);
    add(h, "frame-src", ["https://player.vimeo.com"]);
  }

  if (features.productHunt) {
    add(h, "connect-src", ["https://api.producthunt.com"]);
    add(h, "img-src", ["https://www.producthunt.com"]);
    add(h, "frame-src", ["https://www.producthunt.com"]);
  }

  if (features.gravatar) {
    add(h, "img-src", ["https://www.gravatar.com/"]);
  }

  for (const key of Object.keys(h)) {
    if (Array.isArray(h[key])) h[key] = uniq(h[key]);
  }

  h["script-src-elem"] = [...(h["script-src"] || [])];

  return h;
}

/* ==========================================================================
   ROUTE GROUPS
   ========================================================================== */

const authRoutes = securityOptions.auth.routes;
const authPrefix = normalizePrefix(authRoutes.login, "/auth/");
const apiAuthPrefix = normalizePrefix(authRoutes.logout, "/api/auth/");

export const securityRouteGroups = [
  ...(securityOptions.auth.enabled
    ? [
        {
          id: "auth",
          pattern: authPrefix,
          headers: {
            "Cache-Control": "no-store, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
          },
          cspAdjust(base) {
            add(base, "form-action", ["'self'"]);
            return base;
          },
        },
        {
          id: "account",
          pattern: "/account/",
          headers: {
            "Cache-Control": "no-store, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
          },
          cspAdjust(base) {
            add(base, "form-action", ["'self'"]);
            return base;
          },
        },
        {
          id: "dashboard",
          pattern: normalizePrefix(authRoutes.dashboard, "/dashboard/"),
          headers: {
            "Cache-Control": "no-store, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
          },
          cspAdjust(base) {
            add(base, "form-action", ["'self'"]);
            return base;
          },
        },
        {
          id: "auth-api",
          pattern: apiAuthPrefix,
          headers: {
            "Cache-Control": "no-store, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      ]
    : []),

  {
    id: "api",
    pattern: "/api/",
    headers: {
      "Cache-Control": "no-store, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  },

  {
    id: "static-assets",
    pattern: "/_astro/",
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },

  {
    id: "fonts",
    pattern: "/fonts/",
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Cross-Origin-Resource-Policy": "same-origin",
    },
  },

  {
    id: "icons",
    pattern: "/icons/",
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },

  {
    id: "brand",
    pattern: "/brand/",
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
];

export function getRouteGroup(pathname = "/") {
  const path = String(pathname || "/").toLowerCase();
  return securityRouteGroups.find((g) => path.startsWith(g.pattern.toLowerCase())) || null;
}

/* ==========================================================================
   ORDERING
   ========================================================================== */

function orderScriptSrc(list, nonceToken) {
  const set = new Set(list);
  const hosts = Array.from(set).filter(
    (v) => v !== "'self'" && v !== "'report-sample'" && v !== nonceToken
  );

  return ["'self'", ...(nonceToken ? [nonceToken] : []), "'report-sample'", ...hosts];
}

function orderStyleSrc(list, nonceToken) {
  const set = new Set(list);
  const hosts = Array.from(set).filter(
    (v) => v !== "'self'" && v !== "'report-sample'" && v !== nonceToken
  );

  return ["'self'", ...(nonceToken ? [nonceToken] : []), "'report-sample'", ...hosts];
}

/* ==========================================================================
   PUBLIC API
   ========================================================================== */

export function getSecurityHeaders(nonce = "", pathname = "/") {
  const h = buildDirectivesBase();
  const group = getRouteGroup(pathname);

  if (group?.cspAdjust) {
    group.cspAdjust(h, { nonce, pathname });
  }

  const nonceToken = nonce ? `'nonce-${nonce}'` : undefined;

  h["script-src"] = orderScriptSrc(
    nonceToken ? uniq([...(h["script-src"] || []), nonceToken]) : h["script-src"],
    nonceToken
  );

  h["script-src-elem"] = [...(h["script-src"] || [])];

  h["style-src"] = orderStyleSrc(
    nonceToken ? uniq([...(h["style-src"] || []), nonceToken]) : h["style-src"],
    nonceToken
  );

  if (!nonce && securityOptions.csp.staticAllowInlineStyle) {
    add(h, "style-src", ["'unsafe-inline'"]);
  }

  if (!nonce && securityOptions.csp.staticAllowInlineScript) {
    add(h, "script-src", ["'unsafe-inline'"]);
    h["script-src-elem"] = [...(h["script-src"] || [])];
  }

  return h;
}

export function serializeCsp(policyObject) {
  return Object.entries(policyObject)
    .map(([key, value]) => {
      if (value === true) return key;
      const vals = Array.isArray(value) ? value : [value];
      return `${key} ${vals.join(" ")}`.trim();
    })
    .join("; ");
}

export const extraHttpHeadersBase = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), camera=(), microphone=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Origin-Agent-Cluster": "?1",
  "X-Permitted-Cross-Domain-Policies": "none",

  // Default HTML-safe cache.
  "Cache-Control": "public, max-age=0, must-revalidate",

  ...(securityOptions.hsts.enabled
    ? {
        "Strict-Transport-Security": securityOptions.hsts.value,
      }
    : {}),

  ...(originOf(securityOptions.endpoints.cspReportHandler || securityOptions.csp.reportUri)
    ? {
        "Reporting-Endpoints": `csp-endpoint="${originOf(
          securityOptions.endpoints.cspReportHandler || securityOptions.csp.reportUri
        )}"`,
      }
    : {}),
};

export function getExtraHttpHeaders(pathname = "/") {
  const base = { ...extraHttpHeadersBase };
  const group = getRouteGroup(pathname);

  if (group?.headers) {
    for (const [key, value] of Object.entries(group.headers)) {
      base[key] = value;
    }
  }

  return base;
}

export const securityHeaders = getSecurityHeaders("", "/");
export const extraHttpHeaders = getExtraHttpHeaders("/");