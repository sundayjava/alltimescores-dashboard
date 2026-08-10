import { api } from "@/lib/api";
import {
  CategoriesResponse,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryQueryParams,
} from "@/types/category";

const BASE = "/cms/categories";

export async function getCategories(
  params?: CategoryQueryParams
): Promise<CategoriesResponse> {
  const response = await api.get<CategoriesResponse>(BASE, { params });
  return response.data;
}

export async function getCategoryById(id: string): Promise<CategoryResponse> {
  const { data } = await api.get<CategoryResponse>(`${BASE}/${id}`);
  return data;
}

export async function createCategory(
  payload: CreateCategoryRequest
): Promise<CategoryResponse> {
  const { data } = await api.post<CategoryResponse>(BASE, payload);
  return data;
}

export async function updateCategory(
  id: string,
  payload: UpdateCategoryRequest
): Promise<CategoryResponse> {
  const { data } = await api.patch<CategoryResponse>(`${BASE}/${id}`, payload);
  return data;
}

export async function deleteCategory(
  id: string
): Promise<{ success: boolean }> {
  const { data } = await api.delete<{ success: boolean }>(`${BASE}/${id}`);
  return data;
}