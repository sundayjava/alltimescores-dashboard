import { api } from "@/lib/api";
import {
  ContentsResponse,
  ContentResponse,
  CreateContentRequest,
  UpdateContentRequest,
  ContentQueryParams,
} from "@/types/content";

const BASE = "/cms/contents";

export async function getContents(
  params?: ContentQueryParams
): Promise<ContentsResponse> {
  const response = await api.get<ContentsResponse>(BASE, { params });
  return response.data;
}

export async function getContentById(id: string): Promise<ContentResponse> {
  const { data } = await api.get<{ success: boolean; data: ContentResponse }>(`${BASE}/${id}`);
  return data.data;
}

export async function createContent(
  payload: CreateContentRequest
): Promise<ContentResponse> {
  const { data } = await api.post<{ success: boolean; data: ContentResponse }>(BASE, payload);
  return data.data;
}

export async function updateContent(
  id: string,
  payload: UpdateContentRequest
): Promise<ContentResponse> {
  const { data } = await api.patch<{ success: boolean; data: ContentResponse }>(`${BASE}/${id}`, payload);
  return data.data;
}

export async function deleteContent(
  id: string
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`${BASE}/${id}`);
  return data;
}

export async function publishContent(id: string): Promise<ContentResponse> {
  const { data } = await api.patch<{ success: boolean; data: ContentResponse }>(`${BASE}/${id}/publish`);
  return data.data;
}

export async function unpublishContent(id: string): Promise<ContentResponse> {
  const { data } = await api.patch<{ success: boolean; data: ContentResponse }>(`${BASE}/${id}/unpublish`);
  return data.data;
}

export async function scheduleContent(
  id: string,
  scheduledAt: string
): Promise<ContentResponse> {
  const { data } = await api.patch<{ success: boolean; data: ContentResponse }>(`${BASE}/${id}/schedule`, {
    scheduledAt,
  });
  return data.data;
}

export async function archiveContent(id: string): Promise<ContentResponse> {
  const { data } = await api.patch<{ success: boolean; data: ContentResponse }>(`${BASE}/${id}/archive`);
  return data.data;
}

export async function restoreDraft(id: string): Promise<ContentResponse> {
  const { data } = await api.patch<{ success: boolean; data: ContentResponse }>(`${BASE}/${id}/draft`);
  return data.data;
}