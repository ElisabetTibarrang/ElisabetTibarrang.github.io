import type { APIRoute } from "astro";
import brandConfig from "@/config/brand.mjs";

const AI_AGENTS = [
  "GPTBot",
  "CCBot",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "FacebookBot",
  "Applebot-Extended",
];

export const GET: APIRoute = ({ site }) => {
  const isProd = import.meta.env.PROD;
  const cfg = brandConfig.robots || {};

  const resolveHref = (input: string | undefined, fallback: string): string => {
    const base = input || fallback;

    try {
      if (/^https?:\/\//i.test(base)) return base;
      return new URL(base, site || brandConfig.siteUrl).href;
    } catch {
      return base;
    }
  };

  const sitemapHref = resolveHref(cfg.sitemapUrl, "/sitemap.xml");
  const rssHref = resolveHref(cfg.rssUrl, "/rss.xml");
  const llmsHref = resolveHref(cfg.llmsUrl, "/llms.txt");

  const extraSitemapHrefs = Array.isArray(cfg.extraSitemaps)
    ? cfg.extraSitemaps.map((u: string) => resolveHref(u, u))
    : [];

  const extraRssHrefs = Array.isArray(cfg.extraRss)
    ? cfg.extraRss.map((u: string) => resolveHref(u, u))
    : [];

  const extraLlmsHrefs = Array.isArray(cfg.extraLlms)
    ? cfg.extraLlms.map((u: string) => resolveHref(u, u))
    : [];

  if (!isProd && cfg.blockAllInNonProd !== false) {
    const lines = [
      "User-agent: *",
      "Disallow: /",
      "",
      "# Sitemaps",
      `Sitemap: ${sitemapHref}`,
      ...extraSitemapHrefs.map((h: string) => `Sitemap: ${h}`),
      "",
      "# RSS feeds",
      `# Main RSS: ${rssHref}`,
      ...extraRssHrefs.map((h: string) => `# Extra RSS: ${h}`),
      "",
      "# LLM helper indexes",
      `# Main LLMs: ${llmsHref}`,
      ...extraLlmsHrefs.map((h: string) => `# Extra LLMs: ${h}`),
      "",
      "# non-production block",
    ];

    return new Response(lines.join("\n"), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const disallow = Array.isArray(cfg.disallow) ? cfg.disallow : [];

  const lines = [
    `# robots.txt generated for ${brandConfig.siteName}`,
    "User-agent: *",
    ...disallow.map((p: string) => `Disallow: ${p}`),
  ];

  if (cfg.blockAICrawlers === true) {
    lines.push("", "# AI crawlers blocked");

    for (const agent of AI_AGENTS) {
      lines.push(`User-agent: ${agent}`, "Disallow: /", "");
    }
  }

  lines.push("", "# Sitemaps", `Sitemap: ${sitemapHref}`);

  for (const h of extraSitemapHrefs) {
    lines.push(`Sitemap: ${h}`);
  }

  lines.push("", "# RSS feeds", `# Main RSS: ${rssHref}`);

  for (const h of extraRssHrefs) {
    lines.push(`# Extra RSS: ${h}`);
  }

  lines.push("", "# LLM helper indexes", `# Main LLMs: ${llmsHref}`);

  for (const h of extraLlmsHrefs) {
    lines.push(`# Extra LLMs: ${h}`);
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};