"use client";

import { X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useAdminUser } from "@/hooks/users/use-users";
import { AdminUserDetail } from "@/types/admin-user";
import { User, UserRole, UserPlan } from "@/types/auth";
import { canChangeRole, canChangeStatusOrDelete, assignableRoles } from "@/lib/admin-guardrails";
import { RoleSelect, PlanSelect } from "./user-columns";
import { cn } from "@/lib/utils";

interface UserDetailDialogProps {
  open: boolean;
  userId: string | null;
  actor: User;
  activeAdminCount: number | undefined;
  onRoleChange: (userId: string, role: UserRole) => void;
  onPlanChange: (userId: string, plan: UserPlan) => void;
  onDeactivate: (user: AdminUserDetail) => void;
  onActivate: (userId: string) => void;
  onDelete: (user: AdminUserDetail) => void;
  onClose: () => void;
}

export function UserDetailDialog({
  open,
  userId,
  actor,
  activeAdminCount,
  onRoleChange,
  onPlanChange,
  onDeactivate,
  onActivate,
  onDelete,
  onClose,
}: UserDetailDialogProps) {
  const { data, isLoading } = useAdminUser(open ? userId : null);
  const user = data?.data;

  if (!open) return null;

  const roleDisabled = user ? !canChangeRole(actor, user) : true;
  const guardOk = user ? canChangeStatusOrDelete(actor, user, activeAdminCount) : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-xl border border-border bg-card shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          "max-h-[90vh] flex flex-col"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
          <h2 className="text-base font-semibold text-card-foreground">User details</h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {isLoading || !user ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-5">
              {/* Identity */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {`${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              {/* Status badge */}
              <div>
                {user.deletedAt ? (
                  <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                    Deleted
                  </span>
                ) : user.isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    Deactivated
                  </span>
                )}
                {user.emailVerified && (
                  <span className="ml-2 text-xs text-muted-foreground">Email verified</span>
                )}
              </div>

              {/* Role / Plan */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Role
                  </p>
                  <RoleSelect
                    user={user}
                    disabled={roleDisabled || !!user.deletedAt}
                    assignable={assignableRoles(actor)}
                    onChange={(role) => onRoleChange(user.id, role)}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Plan
                  </p>
                  <PlanSelect
                    user={user}
                    disabled={!!user.deletedAt}
                    onChange={(plan) => onPlanChange(user.id, plan)}
                  />
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="text-foreground">
                    {format(new Date(user.createdAt), "dd MMM yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last updated</p>
                  <p className="text-foreground">
                    {format(new Date(user.updatedAt), "dd MMM yyyy")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {!user.deletedAt && (
                <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  {user.isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!guardOk}
                      onClick={() => onDeactivate(user)}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => onActivate(user.id)}>
                      Reactivate
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={!guardOk}
                    onClick={() => onDelete(user)}
                  >
                    Delete user
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
