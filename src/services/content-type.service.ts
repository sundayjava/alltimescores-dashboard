import { api } from "@/lib/api";
import {
  ContentTypesResponse,
  ContentTypeResponse,
  CreateContentTypeRequest,
  UpdateContentTypeRequest,
  ContentTypeQueryParams,
} from "@/types/content-type";

const BASE = "/cms/content-types";

export async function getContentTypes(
  params?: ContentTypeQueryParams
): Promise<ContentTypesResponse> {
  const response = await api.get<ContentTypesResponse>(BASE, { params });
  return response.data;
}

export async function getContentTypeById(id: string): Promise<ContentTypeResponse> {
  const { data } = await api.get<ContentTypeResponse>(`${BASE}/${id}`);
  return data;
}

export async function createContentType(
  payload: CreateContentTypeRequest
): Promise<ContentTypeResponse> {
  const { data } = await api.post<ContentTypeResponse>(BASE, payload);
  return data;
}

export async function updateContentType(
  id: string,
  payload: UpdateContentTypeRequest
): Promise<ContentTypeResponse> {
  const { data } = await api.patch<ContentTypeResponse>(`${BASE}/${id}`, payload);
  return data;
}

export async function deleteContentType(id: string): Promise<{ success: boolean }> {
  const { data } = await api.delete<{ success: boolean }>(`${BASE}/${id}`);
  return data;
}