// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import {
  getSecurityHeaders,
  getExtraHttpHeaders,
  serializeCsp,
  securityOptions,
} from "./config/security.mjs";

// The shape of Astro.locals is declared in src/env.d.ts.

type MiddlewareUserRow = {
  id: string;
  email: string;
  role: string;
  status: string;
  mfa_required: number;
  totp_enabled: number;
  recovery_email_verified: number;
  contact_verified: number;
};

const isStatic = String(securityOptions.runtime?.mode || "server").toLowerCase() === "static";
const authEnabled = Boolean(securityOptions.auth?.enabled);

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function makeNonce(): string {
  const bytes = new Uint8Array(16);

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  return (
    Math.random().toString(36).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}

function normalizePath(pathname: string): string {
  const p = String(pathname || "/").toLowerCase().replace(/\/+$/, "");
  return p || "/";
}

function pathMatches(pathname: string, route: string): boolean {
  const p = normalizePath(pathname);
  const r = normalizePath(route);

  if (r === "/") return p === "/";
  return p === r || p.startsWith(`${r}/`);
}

function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathMatches(pathname, prefix));
}

function isPublicPath(pathname: string, publicPaths: string[]) {
  return publicPaths.some((path) => pathMatches(pathname, path));
}

function isHtmlResponse(headers: Headers) {
  return (headers.get("content-type") || "").includes("text/html");
}

function isXmlJsonOrText(pathname: string, headers: Headers) {
  const contentType = headers.get("content-type") || "";
  const lowerPath = pathname.toLowerCase();

  return (
    lowerPath.endsWith(".xml") ||
    lowerPath.endsWith(".json") ||
    lowerPath.endsWith(".webmanifest") ||
    lowerPath.endsWith("/robots.txt") ||
    contentType.includes("application/xml") ||
    contentType.includes("text/xml") ||
    contentType.includes("application/json") ||
    contentType.includes("text/plain")
  );
}

function getCspHeaderName() {
  return import.meta.env.DEV && securityOptions.csp?.reportOnlyInDev
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";
}

function buildCspValue(nonce: string, pathname: string) {
  return serializeCsp(getSecurityHeaders(nonce, pathname));
}

function applyExtraHeaders(headers: Headers, pathname: string) {
  const extra = getExtraHttpHeaders(pathname);

  for (const [key, value] of Object.entries(extra)) {
    headers.set(key, typeof value === "string" ? value : JSON.stringify(value));
  }
}

function mergeHeaders(target: Headers, source: Headers) {
  for (const [key, value] of source.entries()) {
    target.set(key, value);
  }
}

function redirectNoStore(location: string, status = 302): Response {
  return new Response(null, {
    status,
    headers: {
      Location: location,
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

function redirectToLogin(url: URL) {
  const loginPath = securityOptions.auth?.routes?.login || "/auth/login";
  const next = encodeURIComponent(url.pathname + url.search);
  return redirectNoStore(`${loginPath}?next=${next}`);
}

function redirectToPath(path: string, url: URL) {
  const next = encodeURIComponent(url.pathname + url.search);
  const joiner = path.includes("?") ? "&" : "?";
  return redirectNoStore(`${path}${joiner}next=${next}`);
}

function jsonUnauthorized(headers: Headers) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("content-type", "application/json; charset=utf-8");

  return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
    status: 401,
    headers: responseHeaders,
  });
}

/* -------------------------------------------------------------------------- */
/* Optional auth hooks                                                         */
/* -------------------------------------------------------------------------- */
/*
  v2 base theme does not require auth files.

  Later, when these files exist:
    src/auth/session.ts
    src/auth/bindings.ts
    src/auth/db.ts

  replace the two functions below with real dynamic imports.
*/

async function getCurrentSessionSafe(_request: Request): Promise<any | null> {
  return null;
}

async function getMiddlewareUserSafe(_userId: string): Promise<MiddlewareUserRow | null> {
  return null;
}

/* -------------------------------------------------------------------------- */
/* Response wrapper                                                            */
/* -------------------------------------------------------------------------- */

function applyResponseSecurity(res: Response, pathname: string, nonce: string) {
  const responseHeaders = new Headers(res.headers);

  applyExtraHeaders(responseHeaders, pathname);

  if (isXmlJsonOrText(pathname, responseHeaders)) {
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  }

  if (isHtmlResponse(responseHeaders)) {
    responseHeaders.set(getCspHeaderName(), buildCspValue(nonce, pathname));
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}

/* -------------------------------------------------------------------------- */
/* Middleware                                                                  */
/* -------------------------------------------------------------------------- */

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const nonce = makeNonce();

  context.locals.nonce = nonce;

  const baseHeaders = new Headers();
  applyExtraHeaders(baseHeaders, pathname);

  /*
    Static mode:
    - middleware still runs
    - nonce is available to components
    - security headers are applied
    - auth/database/session is skipped
  */
  if (isStatic || !authEnabled) {
    const res = await next();

    if (!res) {
      return new Response(null, {
        status: 204,
        headers: baseHeaders,
      });
    }

    return applyResponseSecurity(res, pathname, nonce);
  }

  const auth = securityOptions.auth || {};
  const routes = auth.routes || {};

  const loginRoute = routes.login || "/auth/login";
  const signupRoute = routes.signup || "/auth/signup";
  const setupAccountRoute = routes.setupAccount || "/auth/setup-account";
  const totpRoute = routes.totp || "/auth/totp";
  const forgotPasswordRoute = routes.forgotPassword || "/auth/forgot-password";
  const resetPasswordRoute = routes.resetPassword || "/auth/reset-password";
  const recoverMfaRoute = routes.recoverMfa || "/auth/recover-mfa";
  const dashboardRoute = routes.dashboard || "/dashboard";
  const accountRoute = routes.account || "/account";

  const isDev = import.meta.env.DEV;
  const devBypass = Boolean((auth as any).devBypass);

  if (isDev && devBypass) {
    context.locals.session = {
      sessionId: "dev-session",
      userId: "dev-user",
      email: "dev@local",
      role: "admin",
      mfaVerified: true,
    };

    context.locals.user = {
      sessionId: "dev-session",
      userId: "dev-user",
      email: "dev@local",
      role: "admin",
      mfaRequired: false,
      totpEnabled: true,
      recoveryEmailVerified: true,
      contactVerified: true,
    };

    const res = await next();

    if (!res) {
      return new Response(null, {
        status: 204,
        headers: baseHeaders,
      });
    }

    return applyResponseSecurity(res, pathname, nonce);
  }

  const publicPages = [
    "/",
    "/blog",
    "/pages",
    "/doc",
    "/feature",
    "/post",
    "/resource",
    "/review",
    "/service",
    "/team",
    "/videos",

    loginRoute,
    signupRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
    recoverMfaRoute,
  ];

  const publicApis = [
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/auth/magic",
    "/api/auth/totp/verify",
    "/api/auth/totp/setup",
    "/api/auth/totp/reset",
    "/api/auth/recover-mfa",
  ];

  const protectedPages = [
    dashboardRoute,
    accountRoute,
    "/dashboard",
    "/admin",
    "/auth/account",
    "/auth/security",
  ];

  const protectedApis = [
    "/api/admin",
    "/api/media/private",
    "/api/content",
    "/api/dashboard",
  ];

  const isApi = normalizePath(pathname).startsWith("/api/");
  const isPublicApi = isPublicPath(pathname, publicApis);
  const isProtectedApi = startsWithAny(pathname, protectedApis);
  const isProtectedPage = startsWithAny(pathname, protectedPages);
  const isPublicPage = isPublicPath(pathname, publicPages);

  const mustProtect =
    isProtectedPage ||
    isProtectedApi ||
    (isApi && !isPublicApi && !isPublicPage && startsWithAny(pathname, protectedApis));

  let session: any = null;

  if (mustProtect || auth.enabled) {
    session = await getCurrentSessionSafe(context.request);
  }

  if (mustProtect && !session) {
    if (isApi && !isPublicApi) {
      return jsonUnauthorized(baseHeaders);
    }

    const res = redirectToLogin(context.url);
    const redirectHeaders = new Headers(res.headers);
    mergeHeaders(redirectHeaders, baseHeaders);

    return new Response(null, {
      status: res.status,
      headers: redirectHeaders,
    });
  }

  if (session) {
    context.locals.session = session;

    const user = await getMiddlewareUserSafe(session.userId);

    if (!user) {
      if (isApi || isProtectedApi) {
        return jsonUnauthorized(baseHeaders);
      }

      if (isProtectedPage) {
        const res = redirectToLogin(context.url);
        const redirectHeaders = new Headers(res.headers);
        mergeHeaders(redirectHeaders, baseHeaders);

        return new Response(null, {
          status: res.status,
          headers: redirectHeaders,
        });
      }
    } else {
      const mfaRequired = user.mfa_required === 1;
      const totpEnabled = user.totp_enabled === 1;

      context.locals.user = {
        sessionId: session.sessionId,
        userId: session.userId,
        role: session.role,
        email: session.email,
        mfaRequired,
        totpEnabled,
        recoveryEmailVerified: user.recovery_email_verified === 1,
        contactVerified: user.contact_verified === 1,
      };

      const isSetupAccountPage = pathMatches(pathname, setupAccountRoute);
      const isTotpPage = pathMatches(pathname, totpRoute);

      const isProtectedAppPage =
        pathMatches(pathname, dashboardRoute) ||
        pathMatches(pathname, accountRoute) ||
        pathMatches(pathname, "/auth/account") ||
        pathMatches(pathname, "/admin");

      if (mfaRequired && !totpEnabled) {
        if (isTotpPage || isProtectedAppPage) {
          const res = redirectToPath(setupAccountRoute, context.url);
          const redirectHeaders = new Headers(res.headers);
          mergeHeaders(redirectHeaders, baseHeaders);

          return new Response(null, {
            status: res.status,
            headers: redirectHeaders,
          });
        }
      }

      if (mfaRequired && totpEnabled && isSetupAccountPage) {
        const res = redirectNoStore(dashboardRoute);
        const redirectHeaders = new Headers(res.headers);
        mergeHeaders(redirectHeaders, baseHeaders);

        return new Response(null, {
          status: res.status,
          headers: redirectHeaders,
        });
      }
    }
  }

  const res = await next();

  if (!res) {
    return new Response(null, {
      status: 204,
      headers: baseHeaders,
    });
  }

  return applyResponseSecurity(res, pathname, nonce);
});