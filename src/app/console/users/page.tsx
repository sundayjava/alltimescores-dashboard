"use client";

import { useAuthStore, selectUser } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/lib/permissions";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <div className="container mx-auto p-8">
      <Link
        href="/console"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Console
      </Link>

      <h1 className="text-3xl font-bold">Users Management</h1>
      <p className="text-muted-foreground mt-2">
        Manage all users in the system.
      </p>

      {/* TODO: Add users table/content here */}
    </div>
  );
}