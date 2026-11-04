// src/config/brand.mjs
//
// START HERE. Every value in this file is a dummy placeholder.
// Replace the ones you need, delete the ones you do not, then run `pnpm brand`
// to regenerate favicons and the web manifest.

const CONTACT_EMAIL = "hello@example.com"; // EDIT

export const brandConfig = {
  // ---------------------------------------------------------------------------
  // Site identity
  // ---------------------------------------------------------------------------
  siteName: "Your Site Name", // EDIT
  shortName: "Your Site", // EDIT (used in the web manifest, keep it short)
  title: "Your Site Name | A short tagline", // EDIT (default <title>)
  description:
    "Replace this with one or two sentences that describe your site. It is used as the default meta description and in the About page.", // EDIT

  siteUrl: "https://example.com/", // EDIT: your real domain, used for canonical URLs, sitemap and RSS
  lang: "en",
  locale: "en_US",
  separator: "|",

  keywords: ["your keyword", "another keyword"], // EDIT

  // ---------------------------------------------------------------------------
  // Theme / manifest
  // ---------------------------------------------------------------------------
  themeColor: "#a55aff", // EDIT: also set the palette in src/config/colors.css
  backgroundColor: "#ffffff",

  // The ONE shared image: Open Graph, Twitter card, home hero and every blog
  // post use this file. Replace public/images/featured.png (keep the name and
  // set the real size below) or point this at your own public URL path.
  featuredImage: "/images/featured.png",
  featuredImageAlt: "Featured image", // EDIT
  featuredImageTitle: "Your Site Name", // EDIT
  featuredImageWidth: 1280,
  featuredImageHeight: 720,

  // ---------------------------------------------------------------------------
  // Logo
  // The header and footer show the site name as a text logo (src/components/header/Logo.astro).
  // The only image asset is the icon below. `pnpm brand` turns it into favicon.ico,
  // favicon.svg, apple-touch-icon.png and the Android icons. Replace the SVG with your own
  // mark (keep it square) or point the path somewhere else.
  // ---------------------------------------------------------------------------
  input: {
    favicon: "src/assets/brand/favicon.svg",
  },

  output: {
    publicBrandDir: "public/brand",
    dataManifest: "src/data/brand/manifest.mjs",
    webManifest: "public/manifest.webmanifest",
  },

  publicBase: "/brand",

  svgo: {
    enabled: true,
    multipass: false,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            cleanupIds: false,
            convertColors: false,
          },
        },
      },
      "removeDimensions",
      "removeScripts",
    ],
  },

  // ---------------------------------------------------------------------------
  // Generated/public asset paths used by runtime components
  // These can be overwritten by generated src/data/brand/manifest.mjs later.
  // ---------------------------------------------------------------------------
  icons: {
    favicon: "/favicon.ico",
    faviconSvg: "/favicon.svg",
    appleTouchIcon: "/apple-touch-icon.png",
    webManifest: "/manifest.webmanifest",
  },

  // ---------------------------------------------------------------------------
  // Contact / repeated links
  // Leave a value as "" to hide it. Phone and WhatsApp are empty until you add
  // yours, so the template never shows a fake number.
  // ---------------------------------------------------------------------------
  contact: {
    email: CONTACT_EMAIL,
    phone: "", // EDIT, e.g. "+1 555 123 4567"
    whatsapp: "", // EDIT, digits only with country code, e.g. "15551234567"
  },

  // Placeholders point at each network's home page, never at a real profile.
  // Replace each with your full profile URL, or set "" to hide that icon.
  socialLinks: {
    facebook: "https://facebook.com", // EDIT or ""
    instagram: "https://instagram.com", // EDIT or ""
    email: CONTACT_EMAIL,
    linkedin: "https://linkedin.com", // EDIT or ""
    x: "https://x.com", // EDIT or ""
    youtube: "https://youtube.com", // EDIT or ""
    github: "https://github.com", // EDIT or ""
  },

  shareLinks: [
    "Whatsapp",
    "X",
    "Facebook",
    "LinkedIn",
    "Reddit",
    "Copy Link",
    "Email",
  ],

  // ---------------------------------------------------------------------------
  // Default author
  // Used when page frontmatter has no authors.
  // ---------------------------------------------------------------------------
  defaultAuthor: {
    type: "Person",
    name: "Site Author", // EDIT
    email: "author@example.com", // EDIT
    url: "https://example.com/", // EDIT
  },

  incharge: {
    type: "Person",
    name: "Jane Doe", // EDIT
    email: "jane@example.com", // EDIT
    jobTitle: "Founder", // EDIT
    url: "https://example.com/about-us/", // EDIT
    internalId: "team/jane-doe/",
    contact: {
      email: "jane@example.com", // EDIT
      phone: "",
      whatsapp: "",
    },
    image: "",
    sameAs: [], // EDIT: profile URLs, e.g. "https://linkedin.com/in/your-name"
  },

  // ---------------------------------------------------------------------------
  // Organization schema defaults (JSON-LD). All placeholder values.
  // Set a field to "" to leave it out.
  // ---------------------------------------------------------------------------
  organization: {
    type: "Organization",
    name: "Example Company", // EDIT
    legalName: "Example Company Ltd", // EDIT
    url: "https://example.com/", // EDIT
    email: "hello@example.com", // EDIT
    logo: "/android-chrome-512x512.png", // generated by `pnpm brand`

    foundingDate: "2020-01-01", // EDIT
    jurisdictionCountry: "US",
    jurisdictionRegion: "",

    taxId: "",
    registrationId: "",
    vatId: "",
    dunsId: "",

    contact: {
      email: "hello@example.com", // EDIT
      phone: "", // EDIT or ""
      whatsapp: "", // EDIT or ""
    },

    address: {
      streetAddress: "123 Example Street", // EDIT or leave ""
      addressLocality: "Springfield", // EDIT
      addressRegion: "CA", // EDIT
      postalCode: "00000", // EDIT
      addressCountry: "United States", // EDIT
      addressCountryCode: "US", // EDIT
      googleMap: "",
    },

    founder: [
      {
        type: "Person",
        name: "Jane Doe", // EDIT
        email: "jane@example.com", // EDIT
        jobTitle: "Founder", // EDIT
        url: "https://example.com/about-us/", // EDIT
        internalId: "team/jane-doe/",
        sameAs: [],
      },
    ],

    sameAs: [], // EDIT: company profile URLs
  },

  // ---------------------------------------------------------------------------
  // Legal pages (privacy policy, cookie policy, terms)
  // ---------------------------------------------------------------------------
  legal: {
    updated: "November 4, 2026", // EDIT when you change the policies
    governingLaw: "the laws of your country or state", // EDIT, e.g. "the laws of England and Wales"
  },

  // ---------------------------------------------------------------------------
  // Feed / sitemap / pagination
  // ---------------------------------------------------------------------------
  rss: true,
  rssUrl: "/rss.xml",
  sitemap: true,

  noOfPostsPerPage: 3,
  postsPerCollectionsPage: 2,

  robots: {
    blockAllInNonProd: true,
    blockAICrawlers: false,

    sitemapUrl: "/sitemap.xml",
    rssUrl: "/rss.xml",
    llmsUrl: "/llms.txt",

    disallow: [
      "/admin/",
      "/api/",
      "/preview/",
      "/draft/",
      "/private/",
    ],

    extraSitemaps: [],
    extraRss: [],
    extraLlms: [],
  },
};

function ensureTrailingSlash(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const isFile = /\.[a-z0-9]{2,8}$/i.test(parsed.pathname);
    if (isFile) return url;
  } catch {
    return url.endsWith("/") ? url : `${url}/`;
  }

  return url.endsWith("/") ? url : `${url}/`;
}

brandConfig.siteUrl = ensureTrailingSlash(brandConfig.siteUrl);

if (brandConfig.organization?.url) {
  brandConfig.organization.url = ensureTrailingSlash(
    brandConfig.organization.url
  );
}

export default brandConfig;
