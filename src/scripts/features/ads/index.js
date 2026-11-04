// src/scripts/features/ads/index.js

(function () {
  "use strict";

  const root = document.getElementById("adsense-root");
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

  if (!config.enabled || !config.clientId) return;

  function hasAdsConsent() {
    return window.__consent?.ads === true;
  }

  function mayLoadAds() {
    return config.consentRequired !== true || hasAdsConsent();
  }

  function loadScript() {
    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.clientId}`;

    if (document.querySelector(`script[src="${src}"]`)) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";

    document.head.appendChild(script);
  }

  function pushAdSlots() {
    const slots = document.querySelectorAll("ins.adsbygoogle");

    slots.forEach((slot) => {
      if (slot.dataset.adsbygoogleStatus === "done") return;

      try {
        window.adsbygoogle = window.adsbygoogle || [];

        if (hasAdsConsent()) {
          window.adsbygoogle.requestNonPersonalizedAds =
            window.__consent?.personalized === true ? 0 : 1;
        }

        window.adsbygoogle.push({});
        slot.dataset.adsbygoogleStatus = "done";
      } catch {}
    });
  }

  function loadAds() {
    if (!mayLoadAds()) return;

    loadScript();

    window.setTimeout(pushAdSlots, 300);
  }

  function idleLoad() {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadAds, { timeout: 2500 });
    } else {
      window.setTimeout(loadAds, 1200);
    }
  }

  if (document.readyState === "complete") {
    idleLoad();
  } else {
    window.addEventListener("load", idleLoad, { once: true });
  }

  document.addEventListener("consent:changed", loadAds);
  document.addEventListener("consent:ads-granted", loadAds);
  document.addEventListener("astro:page-load", loadAds);
})();