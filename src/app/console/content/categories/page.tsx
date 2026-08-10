"use client";

import { useAuthStore, selectUser } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isRoleAtLeast } from "@/lib/permissions";
import { PageHeader } from "@/components/console/Pageheader";
import { CategoryManager } from "@/components/console/content/categories/category";

export default function CategoriesPage() {
  const user = useAuthStore(selectUser);
  const router = useRouter();

  useEffect(() => {
    // Categories are ADMIN/SUPER_ADMIN only per backend routes
    if (user && !isRoleAtLeast(user.role, "ADMIN")) {
      router.push("/console");
    }
  }, [user, router]);

  if (!user || !isRoleAtLeast(user.role, "ADMIN")) {
    return null;
  }

  return (
    <div className="container mx-auto md:p-2 p-4">
      
      <CategoryManager />
    </div>
  );
}