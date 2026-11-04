// src/config/analytics.mjs

export const analyticsConfig = {
  enabled: true,
  prodOnly: true,

  googleTag: {
    enabled: false,
    id: "", // GTM-XXXXXXX
    consentRequired: true,
  },

  googleAnalytics: {
    enabled: false,
    id: "", // G-XXXXXXXXXX
    consentRequired: true,
  },

  cloudflareAnalytics: {
    enabled: false,
    token: "", // 32-char token
    consentRequired: false,
  },

  cloudflareRum: {
    enabled: false,
  },

  ahrefs: {
    enabled: false,
    key: "",
    consentRequired: false,
  },
};

export default analyticsConfig;