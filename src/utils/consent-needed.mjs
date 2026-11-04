// src/utils/consent-needed.mjs
// Which kinds of vendors are on AND need the visitor's consent. The rules match
// the loaders (AnalyticsLoader.astro, AdSenseLoader.astro), so the consent bar
// appears exactly when a script is waiting for it.
import analyticsConfig from "@/config/analytics.mjs";
import adsConfig from "@/config/ads.mjs";

export function consentNeeded() {
  const a = analyticsConfig;

  const analytics =
    a.enabled === true &&
    ((a.googleTag?.enabled === true && a.googleTag?.consentRequired !== false) ||
      (a.googleAnalytics?.enabled === true && a.googleAnalytics?.consentRequired !== false) ||
      (a.cloudflareAnalytics?.enabled === true &&
        a.cloudflareRum?.enabled !== true &&
        a.cloudflareAnalytics?.consentRequired === true) ||
      (a.ahrefs?.enabled === true && a.ahrefs?.consentRequired === true));

  const ads =
    adsConfig.enabled === true &&
    String(adsConfig.adsenseClientId || "").trim().length > 0 &&
    adsConfig.consentRequired !== false;

  return { analytics, ads, any: analytics || ads };
}
