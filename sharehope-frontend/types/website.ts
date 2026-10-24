import type { Media } from "./media";

export type SectionType =
  | "HERO"
  | "MISSION"
  | "IMPACT"
  | "PROGRAMS"
  | "EVENTS"
  | "TESTIMONIALS"
  | "GET_INVOLVED"
  | "PARTNERS"
  | "NEWSLETTER"
  | "CONTENT";

export type ManagedSitePageKey =
  | "about"
  | "our-story"
  | "founder"
  | "team"
  | "donate"
  | "volunteer"
  | "partner"
  | "privacy"
  | "navigation-footer"
  | "seo-social";

/** Matches GET /api/public/website/homepage and /api/admin/website/homepage. */
export interface HomepageSectionResponse {
  key: string;
  type: SectionType;
  displayOrder: number;
  enabled: boolean;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  buttonText: string | null;
  settings: Record<string, unknown>;
}

export interface Homepage {
  name: string;
  slug: string;
  locale: string;
  sections: HomepageSectionResponse[];
}

export interface SectionTranslationInput {
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  buttonText?: string | null;
}

/** Matches PUT /api/admin/website/homepage/sections/{sectionKey}. */
export interface UpdateHomepageSectionInput {
  enabled: boolean;
  displayOrder?: number;
  settings?: Record<string, unknown>;
  en?: SectionTranslationInput;
  fr?: SectionTranslationInput;
}

export interface HomepageSectionUpdateInput {
  sectionKey: string;
  data: UpdateHomepageSectionInput;
}

export interface TranslateContentResponse {
  fields: Record<string, string>;
}

export interface AboutContent {
  body: string;
  teamPhoto?: Media;
  updatedAt: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
}

export type VisualPatchType = "text" | "image" | "video" | "link" | "background";
export interface VisualPatch { selector: string; type: VisualPatchType; value: string; }
export type VisualPatchMap = Record<string, VisualPatch>;
export interface VisualPageContentResponse {
  pagePath: string;
  locale: string;
  draftContent: VisualPatchMap;
  publishedContent: VisualPatchMap;
  updatedAt: string | null;
  publishedAt: string | null;
}
