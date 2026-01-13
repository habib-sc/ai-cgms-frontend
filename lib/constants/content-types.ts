// Content types as typed constants (avoid TS enums).

export interface ContentType {
  id: string;
  label: string;
}

export const CONTENT_TYPES = [
  { id: "blog-post-outline", label: "Blog Post Outline" },
  { id: "blog-post", label: "Blog Post" },
  { id: "product-description", label: "Product Description" },
  { id: "social-media-caption", label: "Social Media Caption" },
  { id: "email-subject-line", label: "Email Subject Line" },
  { id: "ad-copy", label: "Ad Copy" },
] as const satisfies ReadonlyArray<ContentType>;

