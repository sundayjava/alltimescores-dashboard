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