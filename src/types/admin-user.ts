import { UserRole, UserPlan } from "./auth";

// The list endpoint now returns the same shape as the detail endpoint for
// every row (isActive, deletedAt, createdAt, updatedAt included).
export interface AdminUserListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  plan: UserPlan;
  emailVerified: boolean;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AdminUserDetail = AdminUserListItem;

export interface AdminUsersResponse {
  success: boolean;
  data: {
    users: AdminUserListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface AdminUserResponse {
  success: boolean;
  message?: string;
  data: AdminUserDetail;
}

export interface AdminUserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  plan?: UserPlan;
  active?: boolean;
  sortBy?: "createdAt" | "firstName" | "lastName" | "email";
  order?: "asc" | "desc";
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface UpdateUserPlanRequest {
  plan: UserPlan;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}
