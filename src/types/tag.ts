export interface Tag {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  slug: string;
  _count?: {
    contents: number;
  };
}

export interface TagsResponse {
  data: Tag[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TagResponse extends Tag {}

export interface CreateTagRequest {
  name: string;
  description?: string;
}

export interface UpdateTagRequest {
  name?: string;
  description?: string;
}

export interface TagQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}