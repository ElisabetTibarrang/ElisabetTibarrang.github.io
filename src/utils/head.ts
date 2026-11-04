// src/utils/head.ts
import type { ImageMetadata } from "astro";
import type { HeadProps } from "@/types/HeadProps";

export type ImageSource = string | ImageMetadata | undefined | null;

export interface BrandHeadDefaults {
  siteName?: string;
  title?: string;
  description?: string;
  siteUrl?: string;

  featuredImage?: ImageSource;
  og_image?: ImageSource;

  featuredImageAlt?: string;
  featuredImageTitle?: string;
  featuredImageWidth?: number;
  featuredImageHeight?: number;

  defaultAuthor?: any;
  keywords?: string[];
}

export interface NormalizedHeadResult {
  headProps: HeadProps;
  title: string;
  description: string;
  canonicalUrl: string;
  image: string;
  imageAlt: string;
  imageTitle: string;
  imageWidth?: number;
  imageHeight?: number;
  publishedAtISO?: string;
  updatedAtISO?: string;
  authors: NonNullable<HeadProps["authors"]>;
  keywords: string[];
}

export function stripTrailingSlash(input = ""): string {
  return String(input || "").replace(/\/+$/, "");
}

export function absoluteUrl(input?: string, siteUrl = ""): string {
  if (!input) return "";
  if (/^https?:\/\//i.test(input)) return input;

  const base = stripTrailingSlash(siteUrl);
  if (!base) return input;

  return `${base}${input.startsWith("/") ? input : `/${input}`}`;
}

export function toISO(input?: string | Date): string | undefined {
  if (!input) return undefined;

  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function resolveImageUrl(input?: ImageSource, siteUrl = ""): string {
  if (!input) return "";

  if (typeof input === "object" && "src" in input) {
    return absoluteUrl(input.src, siteUrl);
  }

  if (typeof input === "string") {
    return absoluteUrl(input, siteUrl);
  }

  return "";
}

export function normalizeHeadProps(
  rawHeadProps: HeadProps,
  currentPathname: string,
  brandConfig: BrandHeadDefaults = {}
): NormalizedHeadResult {
  const siteUrl = stripTrailingSlash(brandConfig.siteUrl || "");

  const title =
    rawHeadProps.title ||
    brandConfig.title ||
    brandConfig.siteName ||
    "Untitled Page";

  const description =
    rawHeadProps.description ||
    brandConfig.description ||
    "";

  const canonicalUrl = absoluteUrl(
    rawHeadProps.canonicalUrl ||
      rawHeadProps.url ||
      currentPathname ||
      "/",
    siteUrl
  );

  const image = resolveImageUrl(
    rawHeadProps.image ||
      rawHeadProps.heroImage ||
      brandConfig.featuredImage ||
      brandConfig.og_image,
    siteUrl
  );

  const imageAlt =
    rawHeadProps.imageAlt ||
    rawHeadProps.heroImageAlt ||
    brandConfig.featuredImageAlt ||
    title;

  const imageTitle =
    rawHeadProps.imageTitle ||
    rawHeadProps.heroImageTitle ||
    brandConfig.featuredImageTitle ||
    title;

  const imageWidth =
    rawHeadProps.imageWidth ||
    brandConfig.featuredImageWidth;

  const imageHeight =
    rawHeadProps.imageHeight ||
    brandConfig.featuredImageHeight;

  const publishedAtISO =
    rawHeadProps.publishedAtISO ||
    toISO(rawHeadProps.publishedDate);

  const updatedAtISO =
    rawHeadProps.updatedAtISO ||
    toISO(rawHeadProps.lastModified) ||
    publishedAtISO;

  const authors =
    rawHeadProps.authors?.length
      ? rawHeadProps.authors
      : brandConfig.defaultAuthor
        ? [brandConfig.defaultAuthor]
        : [];

  const keywords =
    rawHeadProps.keywords?.length
      ? rawHeadProps.keywords
      : brandConfig.keywords || [];

  const headProps: HeadProps = {
    ...rawHeadProps,
    title,
    description,
    canonicalUrl,
    url: canonicalUrl,
    image,
    imageAlt,
    imageTitle,
    imageWidth,
    imageHeight,
    publishedAtISO,
    updatedAtISO,
    authors,
    keywords,
  };

  return {
    headProps,
    title,
    description,
    canonicalUrl,
    image,
    imageAlt,
    imageTitle,
    imageWidth,
    imageHeight,
    publishedAtISO,
    updatedAtISO,
    authors,
    keywords,
  };
}