import { useQuery } from "@tanstack/react-query";
import {
  getAdminUsers,
  getActiveAdminUsers,
  getInactiveAdminUsers,
  getAdminUserById,
} from "@/services/admin-user.service";
import { AdminUserListQueryParams } from "@/types/admin-user";

export type AdminUserStatusFilter = "all" | "active" | "inactive";

export const USER_KEYS = {
  all: ["admin-users"] as const,
  list: (status: AdminUserStatusFilter, params: AdminUserListQueryParams) =>
    ["admin-users", "list", status, params] as const,
  detail: (id: string) => ["admin-users", "detail", id] as const,
  activeAdminCount: ["admin-users", "active-admin-count"] as const,
};

export function useAdminUsers(
  status: AdminUserStatusFilter,
  params: AdminUserListQueryParams = {}
) {
  return useQuery({
    queryKey: USER_KEYS.list(status, params),
    queryFn: () => {
      if (status === "active") return getActiveAdminUsers(params);
      if (status === "inactive") return getInactiveAdminUsers(params);
      return getAdminUsers(params);
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });
}

export function useAdminUser(id: string | null) {
  return useQuery({
    queryKey: USER_KEYS.detail(id ?? ""),
    queryFn: () => getAdminUserById(id as string),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
}

// The list endpoint doesn't return isActive per row, so we can't count
// active admins from an already-fetched page. Instead we ask the API for
// the total count directly via the active-users endpoint (limit: 1 — we
// only need `pagination.total`, not the rows).
export function useActiveAdminCount() {
  return useQuery({
    queryKey: USER_KEYS.activeAdminCount,
    queryFn: async () => {
      const [admins, superAdmins] = await Promise.all([
        getActiveAdminUsers({ role: "ADMIN", limit: 1 }),
        getActiveAdminUsers({ role: "SUPER_ADMIN", limit: 1 }),
      ]);
      return admins.data.pagination.total + superAdmins.data.pagination.total;
    },
    staleTime: 1000 * 30,
  });
}
