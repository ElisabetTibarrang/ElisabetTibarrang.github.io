// src/scripts/features/consent/index.js
// Cookie bar: Accept grants analytics and ads, Decline denies both. The choice
// is kept in a cookie. Loaders listen for the "consent:*" events and read
// window.__consent.

(function () {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  const cookie = {
    get(name) {
      const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
      if (!match) return null;

      try {
        return JSON.parse(decodeURIComponent(match[1]));
      } catch {
        return null;
      }
    },

    set(name, value, days) {
      const secure = location.protocol === "https:" ? "; Secure" : "";
      const maxAge = `; max-age=${Number(days || 180) * 86400}`;

      document.cookie = `${name}=${encodeURIComponent(
        JSON.stringify(value)
      )}; path=/${maxAge}; SameSite=Lax${secure}`;
    },

    delete(name) {
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
    },
  };

  function readConfig() {
    const root = document.getElementById("consent-root");
    if (!root) return null;

    try {
      return JSON.parse(decodeURIComponent(root.dataset.config || "{}"));
    } catch {
      return null;
    }
  }

  function applyGoogleConsent(granted, cfg) {
    window.dataLayer = window.dataLayer || [];

    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };

    const value = granted ? "granted" : "denied";

    window.gtag("consent", "update", {
      analytics_storage: value,
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      personalization_storage: value,
      functionality_storage: "granted",
      security_storage: "granted",
    });

    if (cfg.googleConsentMode?.urlPassthrough) {
      window.gtag("set", "url_passthrough", true);
    }

    if (cfg.googleConsentMode?.adsDataRedaction) {
      window.gtag("set", "ads_data_redaction", true);
    }
  }

  function emitEvents(previous, current) {
    document.dispatchEvent(new CustomEvent("consent:changed", { detail: current }));

    if (!previous?.analytics && current.analytics) {
      document.dispatchEvent(new CustomEvent("consent:analytics-granted"));
    }
    if (previous?.analytics && !current.analytics) {
      document.dispatchEvent(new CustomEvent("consent:analytics-denied"));
    }
    if (!previous?.ads && current.ads) {
      document.dispatchEvent(new CustomEvent("consent:ads-granted"));
    }
    if (previous?.ads && !current.ads) {
      document.dispatchEvent(new CustomEvent("consent:ads-denied"));
    }
  }

  function setConsent(granted, cfg, persist) {
    const previous = window.__consent || null;

    const current = {
      analytics: granted,
      ads: granted,
      personalized: granted,
      ts: Date.now(),
      v: cfg.version || "1",
    };

    window.__consent = current;

    applyGoogleConsent(granted, cfg);
    emitEvents(previous, current);

    if (persist) {
      cookie.set(cfg.cookieName, current, cfg.ttlDays);
    }
  }

  function isExpired(saved, ttlDays, version) {
    if (!saved?.ts) return true;
    if (saved.v !== version) return true;

    return Date.now() - Number(saved.ts) > Number(ttlDays || 180) * 86400 * 1000;
  }

  function show(bar, toggler, visible) {
    bar?.classList.toggle("is-hidden", !visible);
    toggler?.classList.toggle("is-hidden", visible);
  }

  function initConsent() {
    const root = document.getElementById("consent-root");
    if (!root || root.dataset.ready === "true") return;

    root.dataset.ready = "true";

    const cfg = readConfig();
    if (!cfg) return;

    const bar = $("#consent-bar");
    const toggler = $("#consent-toggler");

    const saved = cookie.get(cfg.cookieName);
    if (saved && isExpired(saved, cfg.ttlDays, cfg.version)) {
      cookie.delete(cfg.cookieName);
    }

    const valid = cookie.get(cfg.cookieName);

    if (valid) {
      setConsent(Boolean(valid.analytics || valid.ads), cfg, false);
      show(bar, toggler, false);
    } else {
      setConsent(false, cfg, false);
      show(bar, toggler, true);
    }

    $("#consent-accept")?.addEventListener("click", function () {
      setConsent(true, cfg, true);
      show(bar, toggler, false);
    });

    $("#consent-decline")?.addEventListener("click", function () {
      setConsent(false, cfg, true);
      show(bar, toggler, false);
    });

    toggler?.addEventListener("click", function () {
      show(bar, toggler, true);
      $("#consent-accept")?.focus();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConsent, { once: true });
  } else {
    initConsent();
  }

  document.addEventListener("astro:page-load", initConsent);
})();
