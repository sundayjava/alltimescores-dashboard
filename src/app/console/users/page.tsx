"use client";

import { useAuthStore, selectUser } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/lib/permissions";
import { useEffect } from "react";
import { UserManager } from "@/components/console/users/user-manager";

export default function UsersPage() {
  const user = useAuthStore(selectUser);
  const router = useRouter();

  useEffect(() => {
    // Check permission on mount
    if (user && !hasPermission(user.role, "view_users")) {
      router.push("/console");
    }
  }, [user, router]);

  if (!user || !hasPermission(user.role, "view_users")) {
    return null;
  }

  return (
    <div className="container mx-auto md:p-2 p-4">
      <UserManager />
    </div>
  );
}