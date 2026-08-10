"use client";

import { useAuthStore, selectUser } from "@/stores/auth-store";
import { hasPermission, hasAnyPermission, hasAllPermissions, isRoleAtLeast } from "@/lib/permissions";
import { Button } from "@/components/ui/button";

export function PermissionExamples() {
  const user = useAuthStore(selectUser);

  if (!user) return null;

  // Single permission check
  const canDeleteUsers = hasPermission(user.role, "delete_users");

  // Check any permission
  const canManageContent = hasAnyPermission(user.role, [
    "create_content",
    "edit_content",
    "delete_content",
  ]);

  // Check all permissions
  const hasFullUserAccess = hasAllPermissions(user.role, [
    "view_users",
    "create_users",
    "edit_users",
    "delete_users",
  ]);

  // Role hierarchy check
  const isStaff = isRoleAtLeast(user.role, "EDITOR");

  return (
    <div className="space-y-4">
      {/* Example 1: Show/hide button */}
      {canDeleteUsers && (
        <Button variant="destructive">Delete User</Button>
      )}

      {/* Example 2: Conditional rendering */}
      {canManageContent ? (
        <div>Content Management Panel</div>
      ) : (
        <div>You don't have access to manage content</div>
      )}

      {/* Example 3: Disable button */}
      <Button disabled={!hasFullUserAccess}>
        Advanced User Settings
      </Button>

      {/* Example 4: Role-based message */}
      {isStaff && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p>Staff-only information visible here</p>
        </div>
      )}
    </div>
  );
}