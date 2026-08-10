import { api } from "@/lib/api";
import {
  TagsResponse,
  TagResponse,
  CreateTagRequest,
  UpdateTagRequest,
  TagQueryParams,
} from "@/types/tag";

const BASE = "/cms/tags";

export async function getTags(params?: TagQueryParams): Promise<TagsResponse> {
  const response = await api.get<TagsResponse>(BASE, { params });
  return response.data;
}

export async function getTagById(id: string): Promise<TagResponse> {
  const { data } = await api.get<TagResponse>(`${BASE}/${id}`);
  return data;
}

export async function createTag(payload: CreateTagRequest): Promise<TagResponse> {
  const { data } = await api.post<TagResponse>(BASE, payload);
  return data;
}

export async function updateTag(
  id: string,
  payload: UpdateTagRequest
): Promise<TagResponse> {
  const { data } = await api.patch<TagResponse>(`${BASE}/${id}`, payload);
  return data;
}

export async function deleteTag(id: string): Promise<{ success: boolean }> {
  const { data } = await api.delete<{ success: boolean }>(`${BASE}/${id}`);
  return data;
}