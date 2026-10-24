export interface BlogTranslation {
  title: string;
  excerpt: string;
  body: string;
  imageAlt: string;
  buttonText: string;
  authorName: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
}

export interface AdminBlogPost {
  id: string;
  slug: string;
  category: string;
  format: "ARTICLE" | "VIDEO";
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  displayOrder: number;
  coverImageUrl: string | null;
  videoUrl: string | null;
  durationSeconds: number | null;
  relatedProgramSlug: string | null;
  en: BlogTranslation;
  fr: Partial<BlogTranslation>;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostInput {
  slug: string;
  category: string;
  format: "ARTICLE" | "VIDEO";
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  displayOrder: number;
  coverImageUrl: string | null;
  videoUrl: string | null;
  durationSeconds: number | null;
  relatedProgramSlug: string | null;
  en: BlogTranslation;
  fr: BlogTranslation | null;
}

export interface PublicBlogPostSummary {
  id: string;
  slug: string;
  category: string;
  format: "ARTICLE" | "VIDEO";
  featured: boolean;
  coverImageUrl: string | null;
  videoUrl: string | null;
  durationSeconds: number | null;
  relatedProgramSlug: string | null;
  title: string;
  excerpt: string;
  imageAlt: string;
  buttonText: string;
  authorName: string;
  tags: string[];
  publishedAt: string;
  readingTimeMinutes: number;
}

export interface PublicBlogPost extends PublicBlogPostSummary {
  body: string;
  seoTitle: string;
  seoDescription: string;
}

export interface BlogPageSettings {
  eyebrow: string;
  title: string;
  lead: string;
  featuredLabel: string;
  newsletterTitle: string;
  newsletterBody: string;
  newsletterCta: string;
  emptyState: string;
}
