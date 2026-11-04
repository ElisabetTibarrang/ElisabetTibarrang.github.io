// src/pages/api/contact.ts
// Runs on the Worker (the rest of the site is prerendered). Validates the
// message and forwards it to the email handler configured in
// src/config/contact.mjs. Credentials come from Worker secrets, never from the
// browser.
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

import brandConfig from "@/config/brand.mjs";
import contactConfig from "@/config/contact.mjs";

export const prerender = false;

const MAX_BODY_BYTES = 10_000;
const HANDLER_TIMEOUT_MS = 8_000;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown; // honeypot: real visitors never fill this in
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

function isPlaceholder(value: string) {
  return !value || value.startsWith("REPLACE_");
}

function isConfiguredUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !/(^|\.)example\.com$/i.test(url.hostname);
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  if (contactConfig.enabled === false) {
    return json({ ok: false, error: "disabled" }, 404);
  }

  // Browser same-origin posts only.
  const origin = request.headers.get("origin");
  const sameOrigin =
    origin === new URL(request.url).origin ||
    request.headers.get("sec-fetch-site") === "same-origin";
  if (!sameOrigin) return json({ ok: false, error: "forbidden_origin" }, 403);

  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    return json({ ok: false, error: "invalid_content_type" }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  let body: ContactPayload;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ ok: false, error: "payload_too_large" }, 413);
    }
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  // Honeypot: pretend success so bots do not retry, but send nothing.
  if (clean(body.website, 200)) return json({ ok: true });

  const name = clean(body.name, 80);
  const email = clean(body.email, 160).toLowerCase();
  const subject = clean(body.subject, 60);
  const message = clean(body.message, 4000);

  if (!name || !email || !subject || !message) {
    return json({ ok: false, error: "missing_fields" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "invalid_email" }, 400);
  }
  if (!contactConfig.subjects.includes(subject)) {
    return json({ ok: false, error: "invalid_subject" }, 400);
  }

  const secrets = env as Record<string, string | undefined>;
  const tenantId = String(secrets.TENANT_ID || "").trim();
  const tenantToken = String(secrets.TENANT_API_TOKEN || "").trim();
  const handlerUrl = String(contactConfig.handlerUrl || "").trim();

  if (
    isPlaceholder(tenantId) ||
    isPlaceholder(tenantToken) ||
    !isConfiguredUrl(handlerUrl)
  ) {
    return json({ ok: false, error: "not_configured" }, 503);
  }

  try {
    const response = await fetch(handlerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-id": tenantId,
        "x-tenant-domain": request.headers.get("host") || new URL(request.url).host,
        Authorization: `Bearer ${tenantToken}`,
      },
      body: JSON.stringify({
        template: "contact-form",
        kind: "transactional",
        to: email,
        data: {
          brand: brandConfig.siteName,
          name,
          email,
          subject,
          message,
          requestType: "contact",
        },
      }),
      signal: AbortSignal.timeout(HANDLER_TIMEOUT_MS),
    });

    const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;

    if (!response.ok || !result?.ok) {
      return json({ ok: false, error: "mail_failed" }, 502);
    }

    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "mail_failed" }, 502);
  }
};

// Anything but POST: no body, no hint about the handler.
export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST" } });
