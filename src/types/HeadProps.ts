// src/types/HeadProps.ts

export type URLString = string;
export type ISODateString = string;

/**
 * Known page types used by BaseHead, layouts, and schema components.
 *
 * `(string & {})` allows custom strings without breaking TypeScript, e.g.
 * type: "blog", "research-profile", "landing", etc.
 */
export type PageType =
  | "website"
  | "webpage"
  | "article"
  | "collection"
  | "blog"
  | "post"
  | "documentation"
  | "resource"
  | "service"
  | "person"
  | "profile"
  | "research-profile"
  | "publication"
  | "video"
  | "audio"
  | "review"
  | "event"
  | "contact"
  | "about"
  | "search"
  | "privacy"
  | "terms"
  | "faq"
  | "404"
  | "other"
  | (string & {});

export interface HeadAuthor {
  id?: string;
  name: string;
  slug?: string;
  url?: URLString;
  image?: URLString;
  email?: string;
  sameAs?: URLString[];
  jobTitle?: string;
  affiliation?: string;
  data?: Record<string, unknown>;
}
export interface HeadFaqItem {
  question: string;
  answer: string;
  speakable?: boolean;
}

export interface BreadcrumbItem {
  name?: string;
  label?: string;
  url?: URLString;
  href?: URLString;
}

export interface HeadImage {
  src?: URLString;
  alt?: string;
  title?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface HeadProps {
  title: string;
  description?: string;
  subtitle?: string;
  summary?: string;

  type?: PageType;
  contentType?: string;
  entityType?: string;

  url?: URLString;
  canonicalUrl?: URLString;
  pathname?: string;

  index?: boolean;
  follow?: boolean;
  draft?: boolean;
  featured?: boolean;

  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  nocache?: boolean;

  publishedDate?: Date | string;
  lastModified?: Date | string;
  publishedAtISO?: ISODateString;
  updatedAtISO?: ISODateString;

  keywords?: string[];

  image?: URLString;
  imageAlt?: string;
  imageTitle?: string;
  imageCaption?: string;
  imageWidth?: number;
  imageHeight?: number;
  /** Preload `image` as the first visible image. Set it only on pages that show it above the fold. */
  preloadImage?: boolean;

  heroImage?: URLString;
  heroImageAlt?: string;
  heroImageTitle?: string;
  heroImageCaption?: string;
  heroImageWidth?: number;
  heroImageHeight?: number;

  authors?: HeadAuthor[];

  faq?: HeadFaqItem[];
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumb?: boolean;

  collection?: string;
  collectionBase?: string;
  slug?: string;

  readingTime?: string;
  difficulty?: "beginner" | "intermediate" | "advanced" | (string & {});

  data?: Record<string, unknown>;
}