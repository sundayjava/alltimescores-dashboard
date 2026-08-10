export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  icon?: string | null;
  color?: string | null;
  isActive: boolean;
  sortOrder?: number | null;
  imageId?: string | null;
  createdAt: string;
  updatedAt: string;
  parent?: Pick<Category, "id" | "name" | "slug"> | null;
  image?: { id: string; url: string } | null;
  _count?: {
    children: number;
    contents: number;
  };
}

export interface CategoriesResponse {
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryResponse extends Category {}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  imageId?: string;
  parentId?: string;
  sortOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  imageId?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}