export interface ContentType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  isActive: boolean;
  sortOrder?: number | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    contents: number;
  };
}

export interface ContentTypesResponse {
  data: ContentType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ContentTypeResponse = ContentType;

export interface CreateContentTypeRequest {
  name: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
}

export interface UpdateContentTypeRequest {
  name?: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ContentTypeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}