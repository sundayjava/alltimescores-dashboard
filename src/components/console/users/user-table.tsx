"use client";

import { useCallback, useState } from "react";
import { Search, Users, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminUserListItem } from "@/types/admin-user";
import { User, UserRole, UserPlan } from "@/types/auth";
import { canChangeRole, canChangeStatusOrDelete, assignableRoles } from "@/lib/admin-guardrails";
import {
  SortState,
  SortField,
  SortButton,
  UserCell,
  StatusBadge,
  RoleSelect,
  PlanSelect,
  RowActions,
} from "./user-columns";
import { cn } from "@/lib/utils";

type ActiveFilter = "all" | "active" | "inactive";

const ROLE_FILTER_OPTIONS: { value: UserRole | "all"; label: string }[] = [
  { value: "all", label: "All roles" },
  { value: "USER", label: "User" },
  { value: "AUTHOR", label: "Author" },
  { value: "EDITOR", label: "Editor" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const PLAN_FILTER_OPTIONS: { value: UserPlan | "all"; label: string }[] = [
  { value: "all", label: "All plans" },
  { value: "FREE", label: "Free" },
  { value: "STARTER", label: "Starter" },
  { value: "PRO", label: "Pro" },
  { value: "ENTERPRISE", label: "Enterprise" },
];

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
            <div className="h-3 w-36 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <div className="h-8 w-35 rounded bg-muted animate-pulse" />
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="h-8 w-28 rounded bg-muted animate-pulse" />
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="h-4 w-16 rounded bg-muted animate-pulse" />
      </td>
      <td className="px-4 py-3">
        <div className="h-7 w-7 rounded bg-muted animate-pulse ml-auto" />
      </td>
    </tr>
  );
}

function EmptyState({ hasSearch, onClear }: { hasSearch: boolean; onClear: () => void }) {
  return (
    <tr>
      <td colSpan={5}>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          {hasSearch ? (
            <>
              <p className="text-sm font-medium">No users found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                No users match your search or filters.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={onClear}>
                Clear filters
              </Button>
            </>
          ) : (
            <p className="text-sm font-medium">No users yet</p>
          )}
        </div>
      </td>
    </tr>
  );
}

interface UserTableProps {
  actor: User;
  users: AdminUserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;
  search: string;
  sort: SortState;
  roleFilter: UserRole | "all";
  planFilter: UserPlan | "all";
  activeFilter: ActiveFilter;
  activeAdminCount: number | undefined;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onSortChange: (field: SortField) => void;
  onRoleFilterChange: (role: UserRole | "all") => void;
  onPlanFilterChange: (plan: UserPlan | "all") => void;
  onActiveFilterChange: (filter: ActiveFilter) => void;
  onRoleChange: (user: AdminUserListItem, role: UserRole) => void;
  onPlanChange: (user: AdminUserListItem, plan: UserPlan) => void;
  onView: (user: AdminUserListItem) => void;
  onDeactivate: (user: AdminUserListItem) => void;
  onReactivate: (user: AdminUserListItem) => void;
  onDelete: (user: AdminUserListItem) => void;
}

export function UserTable({
  actor,
  users,
  total,
  page,
  limit,
  totalPages,
  isLoading,
  isFetching,
  search,
  sort,
  roleFilter,
  planFilter,
  activeFilter,
  activeAdminCount,
  onSearchChange,
  onPageChange,
  onSortChange,
  onRoleFilterChange,
  onPlanFilterChange,
  onActiveFilterChange,
  onRoleChange,
  onPlanChange,
  onView,
  onDeactivate,
  onReactivate,
  onDelete,
}: UserTableProps) {
  const [localSearch, setLocalSearch] = useState(search);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onSearchChange(localSearch);
    },
    [localSearch, onSearchChange]
  );

  const handleClear = () => {
    setLocalSearch("");
    onSearchChange("");
    onRoleFilterChange("all");
    onPlanFilterChange("all");
    onActiveFilterChange("all");
  };

  const hasFilters =
    !!search || roleFilter !== "all" || planFilter !== "all" || activeFilter !== "all";

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-border">
        <Select
          value={roleFilter}
          onValueChange={(value) => onRoleFilterChange(value as UserRole | "all")}
          items={ROLE_FILTER_OPTIONS}
        >
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={planFilter}
          onValueChange={(value) => onPlanFilterChange(value as UserPlan | "all")}
          items={PLAN_FILTER_OPTIONS}
        >
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLAN_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted">
          {(["all", "active", "inactive"] as ActiveFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => onActiveFilterChange(f)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize",
                activeFilter === f
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="relative min-w-45 max-w-xs w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search users…"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 pl-8 pr-8 text-sm"
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch("");
                  onSearchChange("");
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {isFetching && !isLoading && (
            <span className="text-xs text-muted-foreground animate-pulse shrink-0">
              Updating…
            </span>
          )}
          {total > 0 && (
            <span className="text-xs text-muted-foreground shrink-0">
              {total} {total === 1 ? "user" : "users"}
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left">
                <SortButton label="Name" field="firstName" sort={sort} onSort={onSortChange} />
              </th>
              <th className="px-4 py-3 text-left hidden sm:table-cell w-38">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Role
                </span>
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell w-30">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Plan
                </span>
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell w-25">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </span>
              </th>
              <th className="px-4 py-3 w-13" aria-label="Actions" />
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : users.length === 0 ? (
              <EmptyState hasSearch={hasFilters} onClear={handleClear} />
            ) : (
              users.map((rowUser) => {
                const isDeleted = !!rowUser.deletedAt;
                const roleDisabled = !canChangeRole(actor, rowUser) || isDeleted;
                const guardOk = canChangeStatusOrDelete(actor, rowUser, activeAdminCount);

                return (
                  <tr
                    key={rowUser.id}
                    className={cn(
                      "group transition-colors hover:bg-muted/30",
                      isFetching && "opacity-60",
                      isDeleted && "opacity-50"
                    )}
                  >
                    <td className="px-4 py-3">
                      <UserCell user={rowUser} />
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <RoleSelect
                        user={rowUser}
                        disabled={roleDisabled}
                        assignable={assignableRoles(actor)}
                        onChange={(role) => onRoleChange(rowUser, role)}
                      />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <PlanSelect
                        user={rowUser}
                        disabled={isDeleted}
                        onChange={(plan) => onPlanChange(rowUser, plan)}
                      />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <StatusBadge user={rowUser} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        user={rowUser}
                        canModify={guardOk}
                        onView={onView}
                        onDeactivate={onDeactivate}
                        onReactivate={onReactivate}
                        onDelete={onDelete}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-xs text-muted-foreground">
            {start}–{end} of {total}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isFetching}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "…" ? (
                  <span key={`e-${idx}`} className="px-1 text-xs text-muted-foreground">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => onPageChange(p as number)}
                    disabled={isFetching}
                    className={cn(
                      "h-7 w-7 rounded-md text-xs font-medium transition-colors",
                      page === p
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {p}
                  </button>
                )
              )}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isFetching}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
