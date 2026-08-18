import { api } from "@/lib/api";
import {
  BroadcastsResponse,
  BroadcastResponse,
  CreateBroadcastRequest,
  BroadcastQueryParams,
} from "@/types/broadcast";

const BASE = "/platform/settings/broadcasts";

export async function getBroadcasts(
  params?: BroadcastQueryParams
): Promise<BroadcastsResponse> {
  const { data } = await api.get<BroadcastsResponse>(BASE, { params });
  return data;
}

export async function createBroadcast(
  payload: CreateBroadcastRequest
): Promise<BroadcastResponse> {
  const { data } = await api.post<BroadcastResponse>(BASE, payload);
  return data;
}

export async function deactivateBroadcast(
  id: string
): Promise<BroadcastResponse> {
  const { data } = await api.patch<BroadcastResponse>(
    `${BASE}/${id}/deactivate`
  );
  return data;
}

export async function reactivateBroadcast(
  id: string
): Promise<BroadcastResponse> {
  const { data } = await api.patch<BroadcastResponse>(
    `${BASE}/${id}/reactivate`
  );
  return data;
}

export async function deleteBroadcast(
  id: string
): Promise<{ success: boolean; message?: string }> {
  const { data } = await api.delete<{ success: boolean; message?: string }>(
    `${BASE}/${id}`
  );
  return data;
}
