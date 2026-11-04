// src/config/consent.mjs
//
// Cookie consent: one small bar with "Accept" and "Decline".
// The bar appears only when a vendor that needs consent is turned on in
// src/config/analytics.mjs (GA4, GTM, ...) or src/config/ads.mjs (AdSense).
// With none of them on, no bar is shown and nothing is stored.

export const consentConfig = {
  // Master switch. false = never show the bar (use only if you add no tracking).
  enabled: true,

  // Where the visitor's choice is stored, and for how long.
  cookieName: "site_consent",
  ttlDays: 180,

  // Change this to ask every visitor again (for example after adding a vendor).
  version: "1",

  // "bottom" | "bottom-left" | "bottom-right"
  position: "bottom",

  // The page linked from the bar. Update it when you add a vendor.
  policyUrl: "/cookie-policy/",

  // Google Consent Mode. Only used when Google Analytics or Tag Manager is on.
  googleConsentMode: {
    urlPassthrough: true,
    adsDataRedaction: true,
  },
};

export default consentConfig;
