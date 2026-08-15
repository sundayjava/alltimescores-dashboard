import { api } from "@/lib/api";
import {
  AdminUsersResponse,
  AdminUserResponse,
  AdminUserQueryParams,
  UpdateUserRoleRequest,
  UpdateUserPlanRequest,
  UpdateUserStatusRequest,
} from "@/types/admin-user";

const BASE = "/platform/admin/users";

export async function getAdminUsers(
  params?: AdminUserQueryParams
): Promise<AdminUsersResponse> {
  // Cache-bust with a unique param on every call. The browser was
  // conditionally revalidating this URL (sending If-None-Match) and the
  // server sometimes answers 304 with a cached body that doesn't reflect
  // the current filters — a server-side ETag that likely isn't scoped to
  // query params. Varying the URL guarantees no cache entry can match, so
  // every request gets a genuine fresh response regardless of that.
  const { data } = await api.get<AdminUsersResponse>(BASE, {
    params: { ...params, _: Date.now() },
  });
  return data;
}

export async function getAdminUserById(id: string): Promise<AdminUserResponse> {
  const { data } = await api.get<AdminUserResponse>(`${BASE}/${id}`);
  return data;
}

export async function updateUserRole(
  id: string,
  payload: UpdateUserRoleRequest
): Promise<AdminUserResponse> {
  const { data } = await api.patch<AdminUserResponse>(`${BASE}/${id}/role`, payload);
  return data;
}

export async function updateUserPlan(
  id: string,
  payload: UpdateUserPlanRequest
): Promise<AdminUserResponse> {
  const { data } = await api.patch<AdminUserResponse>(`${BASE}/${id}/plan`, payload);
  return data;
}

export async function updateUserStatus(
  id: string,
  payload: UpdateUserStatusRequest
): Promise<AdminUserResponse> {
  const { data } = await api.patch<AdminUserResponse>(`${BASE}/${id}/status`, payload);
  return data;
}

export async function deleteAdminUser(id: string): Promise<AdminUserResponse> {
  const { data } = await api.delete<AdminUserResponse>(`${BASE}/${id}`);
  return data;
}
