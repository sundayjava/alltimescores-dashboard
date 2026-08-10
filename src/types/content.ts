export type ContentStatus =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "SCHEDULED"
  | "ARCHIVED";

export type Visibility = "PUBLIC" | "PRIVATE" | "MEMBERS_ONLY";

export interface MediaItem {
  id: string;
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  filename?: string;
  size?: number;
  mimeType?: string;
  createdAt?: string;
}

export interface UserStub {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatar?: string | null;
}

export interface CategoryStub {
  id: string;
  name: string;
  slug: string;
}

export interface ContentTypeStub {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  isActive: boolean;
  sortOrder?: number | null;
}

export interface TagStub {
  id: string;
  name: string;
  slug: string;
}

export interface ContentTag {
  tag: TagStub;
}

export interface SeoMetadata {
  id?: string;
  seoTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: Pick<MediaItem, "id" | "url" | "alt"> | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: Pick<MediaItem, "id" | "url" | "alt"> | null;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: Record<string, unknown> | null;
}

export interface ContentStats {
  viewCount: number;
  commentCount: number;
  reactionCount: number;
  bookmarkCount: number;
  shareCount: number;
  readingCount: number;
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  status: ContentStatus;
  visibility: Visibility;
  categoryId: string;
  category: CategoryStub;
  contentTypeId: string;
  contentType: ContentTypeStub;
  coverImageId?: string | null;
  coverImage?: MediaItem | null;
  authorId: string;
  author: UserStub;
  createdById: string;
  createdBy: UserStub;
  updatedById?: string | null;
  updatedBy?: UserStub | null;
  publishedById?: string | null;
  publishedBy?: UserStub | null;
  seoMetadata?: SeoMetadata | null;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  isFeatured: boolean;
  isBreaking: boolean;
  isPinned: boolean;
  allowComments: boolean;
  readingTime?: number | null;
  tags: ContentTag[];
  stats?: ContentStats | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContentsResponse {
  data: Content[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ContentResponse extends Content {}

export interface SeoRequest {
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: Record<string, unknown>;
}

export interface CreateContentRequest {
  title: string;
  excerpt?: string;
  content: string;
  categoryId: string;
  contentTypeId: string;
  coverImageId?: string;
  tagIds: string[];
  authorId: string;
  visibility: Visibility;
  allowComments: boolean;
  isFeatured: boolean;
  isBreaking: boolean;
  isPinned: boolean;
  seo?: SeoRequest;
}

export interface UpdateContentRequest extends Partial<CreateContentRequest> {
  coverImageId?: string;
}

export interface ContentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  contentTypeId?: string;
  status?: ContentStatus;
}

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  folder?: string;
}

export interface MediaResponse {
  data: MediaItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}