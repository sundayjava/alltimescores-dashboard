import { UserRole } from "@/types/auth";

// Define all possible permissions
export type Permission =
    | "view_dashboard"
    | "view_users"
    | "create_users"
    | "edit_users"
    | "delete_users"
    | "view_content"
    | "create_content"
    | "edit_content"
    | "delete_content"
    | "view_analytics"
    | "view_settings"
    | "edit_settings"
    | "view_notifications" 
    | "manage_roles"
    | "manage_tags"
    | "approve_content"
    | "publish_content"
    | "manage_categories";

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    USER: [
        "view_dashboard",
        "view_content",
        "view_notifications",
    ],

    AUTHOR: [
        "view_dashboard",
        "view_content",
        "create_content",
        "edit_content", // Only their own content (handle in component)
        "view_notifications",
        "view_analytics",
    ],

    EDITOR: [
        "view_dashboard",
        "view_content",
        "create_content",
        "edit_content",
        "delete_content",
        "approve_content",
        "publish_content",
        "manage_tags",
        "view_notifications",
        "view_analytics",
    ],

    ADMIN: [
        "view_dashboard",
        "view_users",
        "create_users",
        "edit_users",
        "delete_users",
        "view_content",
        "create_content",
        "edit_content",
        "delete_content",
        "approve_content",
        "publish_content",
        "view_analytics",
        "view_settings",
        "edit_settings",
        "view_notifications",
        "manage_roles",
        "manage_tags",
        "manage_categories",
    ],

    SUPER_ADMIN: [
        "view_dashboard",
        "view_users",
        "create_users",
        "edit_users",
        "delete_users",
        "view_content",
        "create_content",
        "edit_content",
        "delete_content",
        "approve_content",
        "publish_content",
        "view_analytics",
        "view_settings",
        "edit_settings",
        "view_notifications",
        "manage_roles",
        "manage_tags",
        "manage_categories",
    ],
};

/**
 * Check if a user has a specific permission
 * 
 * @example
 * const canViewUsers = hasPermission(user.role, "view_users");
 * if (canViewUsers) {
 *   // Show users menu
 * }
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if user has ANY of the specified permissions
 * 
 * @example
 * const canManageContent = hasAnyPermission(user.role, ["create_content", "edit_content"]);
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
    return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if user has ALL of the specified permissions
 * 
 * @example
 * const canFullyManageUsers = hasAllPermissions(user.role, ["view_users", "edit_users", "delete_users"]);
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
    return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 * 
 * @example
 * const permissions = getRolePermissions(user.role);
 */
export function getRolePermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Check if user role is at least a certain level
 * Role hierarchy: USER < AUTHOR < EDITOR < ADMIN < SUPER_ADMIN
 * 
 * @example
 * const isAtLeastEditor = isRoleAtLeast(user.role, "EDITOR");
 */
export function isRoleAtLeast(userRole: UserRole, requiredRole: UserRole): boolean {
    const hierarchy: UserRole[] = ["USER", "AUTHOR", "EDITOR", "ADMIN", "SUPER_ADMIN"];
    const userLevel = hierarchy.indexOf(userRole);
    const requiredLevel = hierarchy.indexOf(requiredRole);
    return userLevel >= requiredLevel;
}