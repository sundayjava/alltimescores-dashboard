export type MediaFolder = "contents" | "categories" | "users" | "temp";

export const MEDIA_FOLDERS = {
  CONTENTS: "contents" as MediaFolder,
  CATEGORIES: "categories" as MediaFolder,
  USERS: "users" as MediaFolder,
  TEMP: "temp" as MediaFolder,
};

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export interface MediaUploadedBy {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

// Optional attribution/description fields accepted on upload (multipart) and on
// PATCH (JSON). Max lengths mirror the server's validation so we can catch
// over-long values client-side instead of taking a 400.
export const MEDIA_METADATA_MAX_LENGTH = {
  alt: 300,
  caption: 500,
  description: 2000,
  sourceLabel: 200,
  sourceUrl: 2048,
  licenseLabel: 200,
  licenseUrl: 2048,
} as const;

export type MediaMetadataField = keyof typeof MEDIA_METADATA_MAX_LENGTH;

export const MEDIA_METADATA_FIELDS = Object.keys(
  MEDIA_METADATA_MAX_LENGTH
) as MediaMetadataField[];

/** Values to send. "" is meaningful: it clears the field (stored as NULL). */
export type MediaMetadata = Partial<Record<MediaMetadataField, string>>;

export const EMPTY_MEDIA_METADATA: Required<MediaMetadata> = {
  alt: "",
  caption: "",
  description: "",
  sourceLabel: "",
  sourceUrl: "",
  licenseLabel: "",
  licenseUrl: "",
};

export interface Media {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  extension: string;
  size: number;
  width?: number | null;
  height?: number | null;
  url: string;
  alt?: string | null;
  caption?: string | null;
  description?: string | null;
  sourceLabel?: string | null;
  sourceUrl?: string | null;
  licenseLabel?: string | null;
  licenseUrl?: string | null;
  folder: string;
  isPublic: boolean;
  uploadedById: string;
  uploadedBy: MediaUploadedBy;
  createdAt: string;
  updatedAt: string;
}

export interface MediaListResponse {
  success: boolean;
  data: Media[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}