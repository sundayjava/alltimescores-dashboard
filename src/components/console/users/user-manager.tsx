"use client";

import { useState } from "react";
import { useAuthStore, selectUser } from "@/stores/auth-store";
import { useAdminUsers, useActiveAdminCount } from "@/hooks/users/use-users";
import {
  useUpdateUserRole,
  useUpdateUserPlan,
  useUpdateUserStatus,
  useDeleteUser,
} from "@/hooks/users/use-user-mutations";
import { AdminUserListItem, AdminUserDetail } from "@/types/admin-user";
import { UserRole, UserPlan } from "@/types/auth";
import { PageHeader } from "../Pageheader";
import { UserTable } from "./user-table";
import { SortState, SortField } from "./user-columns";
import { UserStatusDialog } from "./user-status-dialog";
import { UserDeleteDialog } from "./user-delete-dialog";
import { UserDetailDialog } from "./user-detail-dialog";

const PAGE_SIZE = 20;

export function UserManager() {
  const actor = useAuthStore(selectUser);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ field: null, direction: "desc" });
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [planFilter, setPlanFilter] = useState<UserPlan | "all">("all");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [statusTarget, setStatusTarget] = useState<AdminUserListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserListItem | null>(null);

  const queryParams = {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
    plan: planFilter === "all" ? undefined : planFilter,
    active: activeFilter === "all" ? undefined : activeFilter === "active",
    sortBy: sort.field ?? undefined,
    order: sort.field ? sort.direction : undefined,
  };

  const { data, isLoading, isFetching } = useAdminUsers(queryParams);
  const { data: activeAdminCount } = useActiveAdminCount();

  const users = data?.data.users ?? [];
  const pagination = data?.data.pagination;

  const updateRoleMutation = useUpdateUserRole();
  const updatePlanMutation = useUpdateUserPlan();
  const statusMutation = useUpdateUserStatus();
  const deleteMutation = useDeleteUser();

  const handleSortChange = (field: SortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleRoleChange = (user: { id: string }, role: UserRole) => {
    updateRoleMutation.mutate({ id: user.id, role });
  };

  const handlePlanChange = (user: { id: string }, plan: UserPlan) => {
    updatePlanMutation.mutate({ id: user.id, plan });
  };

  const handleStatusConfirm = () => {
    if (!statusTarget) return;
    statusMutation.mutate(
      { id: statusTarget.id, isActive: false },
      { onSuccess: () => setStatusTarget(null) }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const handleReactivate = (user: { id: string }) => {
    statusMutation.mutate({ id: user.id, isActive: true });
  };

  const handleActivateFromDetail = (userId: string) => {
    statusMutation.mutate({ id: userId, isActive: true });
  };

  const handleDeactivateFromDetail = (user: AdminUserDetail) => {
    setStatusTarget(user);
  };

  const handleDeleteFromDetail = (user: AdminUserDetail) => {
    setDeleteTarget(user);
  };

  if (!actor) return null;

  return (
    <>
      <div className="mb-8">
        <PageHeader
          title="Users"
          description="Manage roles, plans, and account status across the platform."
        />
      </div>

      <UserTable
        actor={actor}
        users={users}
        total={pagination?.total ?? 0}
        page={pagination?.page ?? 1}
        limit={PAGE_SIZE}
        totalPages={pagination?.totalPages ?? 1}
        isLoading={isLoading}
        isFetching={isFetching}
        search={search}
        sort={sort}
        roleFilter={roleFilter}
        planFilter={planFilter}
        activeFilter={activeFilter}
        activeAdminCount={activeAdminCount}
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        onPageChange={setPage}
        onSortChange={handleSortChange}
        onRoleFilterChange={(role) => { setRoleFilter(role); setPage(1); }}
        onPlanFilterChange={(plan) => { setPlanFilter(plan); setPage(1); }}
        onActiveFilterChange={(filter) => { setActiveFilter(filter); setPage(1); }}
        onRoleChange={handleRoleChange}
        onPlanChange={handlePlanChange}
        onView={(user) => setViewUserId(user.id)}
        onDeactivate={(user) => setStatusTarget(user)}
        onReactivate={handleReactivate}
        onDelete={(user) => setDeleteTarget(user)}
      />

      <UserStatusDialog
        open={!!statusTarget}
        user={statusTarget}
        isPending={statusMutation.isPending}
        onConfirm={handleStatusConfirm}
        onClose={() => setStatusTarget(null)}
      />

      <UserDeleteDialog
        open={!!deleteTarget}
        user={deleteTarget}
        isPending={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />

      <UserDetailDialog
        open={!!viewUserId}
        userId={viewUserId}
        actor={actor}
        activeAdminCount={activeAdminCount}
        onRoleChange={(userId, role) => handleRoleChange({ id: userId }, role)}
        onPlanChange={(userId, plan) => handlePlanChange({ id: userId }, plan)}
        onDeactivate={handleDeactivateFromDetail}
        onActivate={handleActivateFromDetail}
        onDelete={handleDeleteFromDetail}
        onClose={() => setViewUserId(null)}
      />
    </>
  );
}
