"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  MoreHorizontal,
  Eye,
  UserX,
  UserCheck,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminUserListItem } from "@/types/admin-user";
import { UserRole, UserPlan } from "@/types/auth";
import { cn } from "@/lib/utils";

// ─── Sort types ───────────────────────────────────────────────────────────────
export type SortField = "createdAt" | "firstName" | "lastName" | "email";
export type SortDirection = "asc" | "desc";

export interface SortState {
  field: SortField | null;
  direction: SortDirection;
}

interface SortButtonProps {
  label: string;
  field: SortField;
  sort: SortState;
  onSort: (field: SortField) => void;
  className?: string;
}

export function SortButton({ label, field, sort, onSort, className }: SortButtonProps) {
  const isActive = sort.field === field;
  return (
    <button
      onClick={() => onSort(field)}
      className={cn(
        "flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors",
        isActive && "text-foreground",
        className
      )}
    >
      {label}
      <span className="ml-0.5">
        {isActive ? (
          sort.direction === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-40" />
        )}
      </span>
    </button>
  );
}

// ─── User cell ────────────────────────────────────────────────────────────────
export function UserCell({ user }: { user: AdminUserListItem }) {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {initials || user.email[0]?.toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ user }: { user: Pick<AdminUserListItem, "isActive" | "deletedAt"> }) {
  if (user.deletedAt) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
        Deleted
      </span>
    );
  }
  if (!user.isActive) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        Deactivated
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      Active
    </span>
  );
}

// ─── Verified badge ───────────────────────────────────────────────────────────
export function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) {
    return <span className="text-xs text-muted-foreground">Unverified</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
      <BadgeCheck className="h-3.5 w-3.5" />
      Verified
    </span>
  );
}

// ─── Role select ──────────────────────────────────────────────────────────────
const ROLE_LABELS: Record<UserRole, string> = {
  USER: "User",
  AUTHOR: "Author",
  EDITOR: "Editor",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

interface RoleSelectProps {
  user: AdminUserListItem;
  disabled: boolean;
  assignable: UserRole[];
  onChange: (role: UserRole) => void;
}

export function RoleSelect({ user, disabled, assignable, onChange }: RoleSelectProps) {
  // Always include the user's current role as an option even if it's not
  // normally assignable by this actor (e.g. viewing a SUPER_ADMIN row as a
  // plain ADMIN) — the select needs somewhere to display the current value.
  const options = assignable.includes(user.role) ? assignable : [user.role, ...assignable];

  return (
    <Select
      value={user.role}
      onValueChange={(value) => onChange(value as UserRole)}
      items={options.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
      disabled={disabled}
    >
      <SelectTrigger className="h-8 w-35 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((r) => (
          <SelectItem key={r} value={r}>
            {ROLE_LABELS[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─── Plan select ──────────────────────────────────────────────────────────────
const PLAN_OPTIONS: UserPlan[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];
const PLAN_LABELS: Record<UserPlan, string> = {
  FREE: "Free",
  STARTER: "Starter",
  PRO: "Pro",
  ENTERPRISE: "Enterprise",
};

interface PlanSelectProps {
  user: AdminUserListItem;
  disabled: boolean;
  onChange: (plan: UserPlan) => void;
}

export function PlanSelect({ user, disabled, onChange }: PlanSelectProps) {
  return (
    <Select
      value={user.plan}
      onValueChange={(value) => onChange(value as UserPlan)}
      items={PLAN_OPTIONS.map((p) => ({ value: p, label: PLAN_LABELS[p] }))}
      disabled={disabled}
    >
      <SelectTrigger className="h-8 w-28 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PLAN_OPTIONS.map((p) => (
          <SelectItem key={p} value={p}>
            {PLAN_LABELS[p]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─── Row actions ──────────────────────────────────────────────────────────────
interface RowActionsProps {
  user: AdminUserListItem;
  // Self / last-active-admin guard — irrelevant once the user is already
  // deleted, since every action below is hidden for deleted rows anyway.
  canModify: boolean;
  onView: (user: AdminUserListItem) => void;
  onDeactivate: (user: AdminUserListItem) => void;
  onReactivate: (user: AdminUserListItem) => void;
  onDelete: (user: AdminUserListItem) => void;
}

export function RowActions({
  user,
  canModify,
  onView,
  onDeactivate,
  onReactivate,
  onDelete,
}: RowActionsProps) {
  const isDeleted = !!user.deletedAt;
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 160;
      const menuHeight = 116;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top =
        spaceBelow < menuHeight + 8 ? rect.top - menuHeight - 4 : rect.bottom + 4;
      setMenuPos({ top, left: rect.right - menuWidth });
    }
    setOpen((v) => !v);
  };

  return (
    <div>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleOpen}
        aria-label="Open actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {open &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className="fixed z-50 min-w-40 rounded-lg border border-border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95 duration-100"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              <button
                onClick={() => {
                  onView(user);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
                View details
              </button>

              {!isDeleted && (
                <>
                  {user.isActive ? (
                    <button
                      onClick={() => {
                        if (!canModify) return;
                        onDeactivate(user);
                        setOpen(false);
                      }}
                      disabled={!canModify}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors disabled:pointer-events-none disabled:opacity-40"
                    >
                      <UserX className="h-3.5 w-3.5" />
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onReactivate(user);
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Reactivate
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (!canModify) return;
                      onDelete(user);
                      setOpen(false);
                    }}
                    disabled={!canModify}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:pointer-events-none disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
