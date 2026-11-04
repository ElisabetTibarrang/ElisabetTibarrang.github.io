// src/scripts/features/analytics/index.js

(function () {
  "use strict";

  const root = document.getElementById("analytics-root");
  if (!root || root.dataset.ready === "true") return;

  root.dataset.ready = "true";

  function readConfig() {
    try {
      return JSON.parse(decodeURIComponent(root.dataset.config || "{}"));
    } catch {
      return {};
    }
  }

  const config = readConfig();

  window.dataLayer = window.dataLayer || [];

  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });

  function hasAnalyticsConsent() {
    return window.__consent?.analytics === true;
  }

  function mayLoad(consentRequired) {
    return consentRequired !== true || hasAnalyticsConsent();
  }

  function loadScript(src, attrs = {}) {
    if (!src || document.querySelector(`script[src="${src}"]`)) return;

    const script = document.createElement("script");
    script.src = src;

    for (const [key, value] of Object.entries(attrs)) {
      if (value === true) {
        script.setAttribute(key, "");
      } else if (value !== false && value != null) {
        script.setAttribute(key, String(value));
      }
    }

    document.head.appendChild(script);
  }

  function sendPageView() {
    if (!hasAnalyticsConsent()) return;

    window.gtag?.("event", "page_view", {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname + location.search + location.hash,
      transport_type: "beacon",
    });
  }

  function loadAnalytics() {
    if (config.useGTM && mayLoad(config.gtmConsentRequired)) {
      window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });

      loadScript(
        `https://www.googletagmanager.com/gtm.js?id=${config.gtmId}`,
        { async: true }
      );
    }

    if (config.useGA && mayLoad(config.gaConsentRequired)) {
      loadScript(
        `https://www.googletagmanager.com/gtag/js?id=${config.gaId}`,
        { async: true }
      );

      window.gtag("js", new Date());
      window.gtag("config", config.gaId);
    }

    if (config.useCF && mayLoad(config.cfConsentRequired)) {
      loadScript("https://static.cloudflareinsights.com/beacon.min.js", {
        defer: true,
        "data-cf-beacon": JSON.stringify({
          token: config.cfToken,
        }),
      });
    }

    if (config.useAhrefs && mayLoad(config.ahrefsConsentRequired)) {
      loadScript("https://analytics.ahrefs.com/analytics.js", {
        async: true,
        "data-key": config.ahrefsKey,
      });
    }
  }

  function idleLoad() {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadAnalytics, { timeout: 2500 });
    } else {
      window.setTimeout(loadAnalytics, 1200);
    }
  }

  if (document.readyState === "complete") {
    idleLoad();
  } else {
    window.addEventListener("load", idleLoad, { once: true });
  }

  document.addEventListener("consent:changed", function () {
    loadAnalytics();
    sendPageView();
  });

  document.addEventListener("astro:page-load", function () {
    sendPageView();
  });
})();