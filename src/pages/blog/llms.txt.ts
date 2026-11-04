// src/pages/blog/llms.txt.ts
import type { APIRoute } from "astro";
import { getVisibleCollection, getEntryUrl } from "@/utils/collections.mjs";
import { collections } from "@/config/pages.mjs";
import brandConfig from "@/config/brand.mjs";

export const GET: APIRoute = async () => {
  const cfg = collections.blog;
  const entries = await getVisibleCollection("blog");

  const body = [
    `# ${brandConfig.siteName || "Site"} - ${cfg.title}`,
    "",
    cfg.description || "",
    "",
    "## Articles",
    "",
    ...entries.map((entry: any) => {
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