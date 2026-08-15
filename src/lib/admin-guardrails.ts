import { User, UserRole } from "@/types/auth";

interface RoleAndId {
  id: string;
  role: UserRole;
}

export function isSelf(actor: User, target: { id: string }): boolean {
  return actor.id === target.id;
}

// Only a SUPER_ADMIN may grant SUPER_ADMIN, or change the role of a user
// who already is one.
export function canChangeRole(actor: User, target: RoleAndId): boolean {
  if (isSelf(actor, target)) return false;
  if (target.role === "SUPER_ADMIN" && actor.role !== "SUPER_ADMIN") return false;
  return true;
}

export function assignableRoles(actor: User): UserRole[] {
  const roles: UserRole[] = ["USER", "AUTHOR", "EDITOR", "ADMIN"];
  if (actor.role === "SUPER_ADMIN") roles.push("SUPER_ADMIN");
  return roles;
}

function isAdminRole(role: UserRole): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

// Applies to both status changes (deactivate) and delete — the backend
// enforces both the same way: no self-service, and never remove the last
// active admin/super-admin.
export function canChangeStatusOrDelete(
  actor: User,
  target: RoleAndId,
  activeAdminCount: number | undefined
): boolean {
  if (isSelf(actor, target)) return false;
  if (isAdminRole(target.role) && (activeAdminCount ?? Infinity) <= 1) return false;
  return true;
}
