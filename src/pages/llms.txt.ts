// src/pages/llms.txt.ts
import type { APIRoute } from "astro";
import { getVisibleCollection, getEntryUrl } from "@/utils/collections.mjs";
import { allPagesNormalized } from "@/config/pages.mjs";
import brandConfig from "@/config/brand.mjs";

export const GET: APIRoute = async () => {
  const blogEntries = await getVisibleCollection("blog");

  const pageLinks = Object.values(allPagesNormalized)
    .filter((page: any) => page.enabled && page.llms && page.path)
    .map((page: any) => `- [${page.title || page.label}](${page.path})`);

  const body = [
    `# ${brandConfig.siteName || "Site"}`,
    "",
    brandConfig.description || "",
    "",
    "## Pages",
    "",
    ...pageLinks,
    "",
    "## Blog",
    "",
    ...blogEntries.map((entry: any) => {
      const title = entry.data.title || "Untitled";
      const description = entry.data.description || "";
      const url = getEntryUrl("blog", entry);

      return `- [${title}](${url}): ${description}`;
    }),
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
